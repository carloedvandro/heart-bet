import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Por favor, preencha email e senha");
      return false;
    }

    try {
      setIsLoading(true);
      
      console.log(`Attempting sign-in for email: ${email}`);

      // Add a small initial delay to ensure network is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Add additional options if needed
        }
      });

      if (error) {
        console.error("Signin error details:", {
          name: error.name,
          message: error.message,
          status: error.status
        });
        
        if (error.message?.includes('Failed to fetch')) {
          toast.error("Erro de conexão com o servidor. Por favor, verifique sua conexão e tente novamente em alguns instantes.");
          return false;
        }
        
        switch (error.message) {
          case "Invalid login credentials":
            toast.error("Email ou senha incorretos. Verifique suas credenciais.");
            break;
          case "Email not confirmed":
            toast.error("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
            break;
          default:
            toast.error(`Erro ao fazer login: ${error.message}`);
        }
        
        return false;
      }

      if (!data.session) {
        toast.error("Erro ao iniciar sessão. Tente novamente.");
        return false;
      }

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      toast.error("Ocorreu um erro inesperado. Por favor, tente novamente em alguns instantes.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn
  };
}