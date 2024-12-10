import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthHandlers() {
  const [isLoading, setIsLoading] = useState(false);
  const [signUpAttempts, setSignUpAttempts] = useState(0);
  const [lastSignUpAttempt, setLastSignUpAttempt] = useState(0);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [lastResetAttempt, setLastResetAttempt] = useState(0);

  const MAX_ATTEMPTS = 5;
  const COOLDOWN_PERIOD = 30 * 1000;

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log("Iniciando login para:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Resposta do login:", { data, error });

      if (error) {
        console.error("Erro no login:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
          return;
        }
        
        toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
        return;
      }

      if (data.session) {
        console.log("Login bem sucedido, sessão criada");
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      toast.error("Ocorreu um erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    const currentTime = Date.now();
    
    if (signUpAttempts >= MAX_ATTEMPTS && currentTime - lastSignUpAttempt < COOLDOWN_PERIOD) {
      const secondsLeft = Math.ceil((COOLDOWN_PERIOD - (currentTime - lastSignUpAttempt)) / 1000);
      toast.error(`Muitas tentativas. Aguarde ${secondsLeft} segundos antes de tentar novamente.`);
      return false;
    }

    try {
      setIsLoading(true);
      console.log("Attempting signup for email:", email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      setSignUpAttempts(prev => prev + 1);
      setLastSignUpAttempt(currentTime);

      if (error) {
        console.error("Signup error:", error);
        
        // Handle email rate limit error specifically
        if (error.message?.includes("email rate limit exceeded") || 
            error.message?.includes("over_email_send_rate_limit") ||
            error.status === 429) {
          toast.error("Limite de envio de emails excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
          return false;
        }
        
        toast.error("Erro ao tentar criar conta. Por favor, tente novamente.");
        return false;
      }

      toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
      return true;
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      
      // Additional check for rate limit in catch block
      if (error?.status === 429 || 
          error?.message?.includes("email rate limit exceeded") ||
          error?.message?.includes("over_email_send_rate_limit")) {
        toast.error("Limite de envio de emails excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
        return false;
      }
      
      toast.error("Ocorreu um erro ao tentar criar conta. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    const currentTime = Date.now();
    
    if (resetAttempts >= MAX_ATTEMPTS && currentTime - lastResetAttempt < COOLDOWN_PERIOD) {
      const secondsLeft = Math.ceil((COOLDOWN_PERIOD - (currentTime - lastResetAttempt)) / 1000);
      toast.error(`Muitas tentativas. Aguarde ${secondsLeft} segundos antes de tentar novamente.`);
      return false;
    }

    try {
      setIsLoading(true);
      
      if (!email || !email.includes('@')) {
        toast.error("Por favor, insira um email válido.");
        return false;
      }

      console.log("Tentando resetar senha para o email:", email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      setResetAttempts(prev => prev + 1);
      setLastResetAttempt(currentTime);

      if (error) {
        console.error("Erro detalhado no reset de senha:", error);

        if (error.status === 429) {
          const minutesLeft = Math.ceil(COOLDOWN_PERIOD / 60000);
          toast.error(`Limite de emails excedido. Aguarde ${minutesLeft} minutos antes de tentar novamente.`);
          return false;
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
        return false;
      } 

      toast.success("Se existe uma conta com este email, você receberá instruções para resetar sua senha.");
      return true;
    } catch (error) {
      console.error("Erro inesperado no reset de senha:", error);
      // @ts-ignore
      if (error?.status === 429) {
        toast.error("Limite de emails excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
        return false;
      }
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleResetPassword,
  };
}