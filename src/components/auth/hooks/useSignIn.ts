import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignIn() {
  const handleSignIn = async (email: string, password: string) => {
    console.log("Iniciando login para:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro no login:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
        return;
      }
      
      if (error.message.includes("Email not confirmed")) {
        toast.error("Por favor, confirme seu email antes de fazer login");
        return;
      }
      
      toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
      return;
    }

    if (data.session) {
      console.log("Login bem sucedido");
      toast.success("Login realizado com sucesso!");
    }
  };

  return {
    handleSignIn
  };
}