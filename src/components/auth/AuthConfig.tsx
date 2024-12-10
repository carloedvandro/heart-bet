import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";
import { AuthLinks } from "./AuthLinks";

export function AuthConfig() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [lastResetAttempt, setLastResetAttempt] = useState(0);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error);
        
        if (error.status === 400 && error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos.");
          return;
        }
        
        toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Ocorreu um erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
        
        if (error.status === 429) {
          toast.error("Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente.");
          return;
        }
        
        toast.error("Erro ao tentar criar conta. Por favor, tente novamente.");
      } else {
        toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
        setIsSignUpMode(false);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // @ts-ignore - Adicionando verificação específica para rate limit
      if (error?.status === 429) {
        toast.error("Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente.");
        return;
      }
      
      toast.error("Ocorreu um erro ao tentar criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const currentTime = Date.now();
    const COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutos em milissegundos
    
    // Verificar o período de espera
    if (resetAttempts >= 3 && currentTime - lastResetAttempt < COOLDOWN_PERIOD) {
      const minutesLeft = Math.ceil((COOLDOWN_PERIOD - (currentTime - lastResetAttempt)) / 60000);
      toast.error(`Muitas tentativas. Tente novamente em ${minutesLeft} minutos.`);
      return;
    }

    try {
      setIsLoading(true);
      
      if (!email || !email.includes('@')) {
        toast.error("Por favor, insira um email válido.");
        return;
      }

      console.log(`Tentando resetar senha para o email: ${email}`);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) {
        console.error("Erro detalhado no reset de senha:", error);
        
        // Atualizar contagem de tentativas
        setResetAttempts(prev => prev + 1);
        setLastResetAttempt(currentTime);

        if (error.status === 429) {
          const minutesLeft = Math.ceil(COOLDOWN_PERIOD / 60000);
          toast.error(`Muitas tentativas. Por favor, aguarde ${minutesLeft} minutos antes de tentar novamente.`);
          return;
        }

        switch (error.message) {
          case "For security purposes, you can only request this once every 60 seconds":
            toast.error("Por segurança, você só pode solicitar isso uma vez a cada 60 segundos.");
            break;
          case "User not found":
            toast.error("Não encontramos uma conta com este email.");
            break;
          default:
            toast.error("Erro ao tentar resetar senha. Por favor, tente novamente mais tarde.");
        }
      } else {
        toast.success("Se existe uma conta com este email, você receberá instruções para resetar sua senha.");
        setResetAttempts(0);
        setIsResetMode(false);
      }
    } catch (error) {
      console.error("Erro inesperado no reset de senha:", error);
      
      // @ts-ignore - Adicionando verificação específica para rate limit
      if (error?.status === 429) {
        toast.error("Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente.");
        return;
      }
      
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o email.");
      return;
    }

    if (!isResetMode && !password) {
      toast.error("Por favor, preencha a senha.");
      return;
    }

    if (isResetMode) {
      await handleResetPassword();
    } else if (isSignUpMode) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isResetMode 
            ? "Recuperar Senha" 
            : isSignUpMode 
              ? "Criar Conta" 
              : "Bem-vindo de volta!"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isResetMode 
            ? "Digite seu email para receber instruções"
            : isSignUpMode
              ? "Preencha seus dados para criar uma conta"
              : "Entre com suas credenciais para continuar"}
        </p>
      </div>

      <AuthForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        isResetMode={isResetMode}
        isSignUpMode={isSignUpMode}
        onSubmit={handleSubmit}
      />

      <AuthLinks 
        isResetMode={isResetMode}
        isSignUpMode={isSignUpMode}
        onResetMode={setIsResetMode}
        onSignUpMode={setIsSignUpMode}
      />
    </div>
  );
}