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
        toast.error("Erro ao tentar criar conta. Por favor, tente novamente.");
      } else {
        toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
        setIsSignUpMode(false);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Ocorreu um erro ao tentar criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      
      if (!email || !email.includes('@')) {
        toast.error("Por favor, insira um email válido.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Detailed Reset Password Error:", error);
        
        switch (error.message) {
          case "Error sending recovery email":
            toast.error("Não foi possível enviar o email de recuperação. Tente novamente mais tarde.");
            break;
          case "User not found":
            toast.error("Não encontramos uma conta com este email.");
            break;
          default:
            toast.error(`Erro ao resetar senha: ${error.message}`);
        }
      } else {
        toast.success("Se existe uma conta com este email, você receberá instruções para resetar sua senha.");
        setIsResetMode(false);
      }
    } catch (error) {
      console.error("Unexpected error in password reset:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
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