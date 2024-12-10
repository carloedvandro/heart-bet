import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [lastResetAttempt, setLastResetAttempt] = useState(0);

  const MAX_ATTEMPTS = 5;
  const COOLDOWN_PERIOD = 30 * 1000;

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
    handleResetPassword
  };
}