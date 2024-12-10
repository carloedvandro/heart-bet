import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignIn() {
  const handleSignIn = async (email: string, password: string) => {
    console.log("Iniciando tentativa de login para:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
          return false;
        }
        
        if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login");
          return false;
        }
        
        toast.error("Erro ao tentar fazer login");
        return false;
      }

      if (data?.session) {
        console.log("Login bem sucedido para:", email);
        toast.success("Login realizado com sucesso!");
        return true;
      }

      console.error("Resposta inesperada do Supabase:", data);
      toast.error("Erro inesperado ao fazer login");
      return false;
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      toast.error("Erro inesperado ao fazer login");
      return false;
    }
  };

  return {
    handleSignIn
  };
}