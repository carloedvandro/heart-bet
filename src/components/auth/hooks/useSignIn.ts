import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignIn() {
  const handleSignIn = async (email: string, password: string) => {
    console.log("Iniciando login para:", email);
    
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
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
        
        toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
        return false;
      }

      if (session) {
        console.log("Login bem sucedido para:", session.user.email);
        toast.success("Login realizado com sucesso!");
        return true;
      }

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