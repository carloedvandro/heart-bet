import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [signUpAttempts, setSignUpAttempts] = useState(0);
  const [lastSignUpAttempt, setLastSignUpAttempt] = useState(0);

  const MAX_ATTEMPTS = 5;
  const COOLDOWN_PERIOD = 30 * 1000;

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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email: email
          }
        }
      });

      setSignUpAttempts(prev => prev + 1);
      setLastSignUpAttempt(currentTime);

      if (error) {
        console.error("Signup error:", error);
        
        if (error.message?.includes("User already registered")) {
          toast.error("Este email já está registrado. Por favor, faça login.");
          return false;
        }
        
        if (error.message?.includes("email rate limit exceeded") || 
            error.message?.includes("over_email_send_rate_limit") ||
            error.status === 429) {
          toast.error("Limite de envio de emails excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
          return false;
        }
        
        toast.error("Erro ao tentar criar conta. Por favor, tente novamente.");
        return false;
      }

      if (data?.user?.identities?.length === 0) {
        toast.error("Este email já está registrado. Por favor, faça login.");
        return false;
      }

      if (data?.user?.confirmation_sent_at) {
        toast.success("Conta criada com sucesso! Por favor, verifique seu email para confirmar sua conta.", {
          duration: 6000
        });
        return true;
      } else {
        toast.success("Conta criada com sucesso! Você já pode fazer login.", {
          duration: 4000
        });
        return true;
      }

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      
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

  return {
    isLoading,
    handleSignUp
  };
}