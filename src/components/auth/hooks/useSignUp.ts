import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSignUp() {
  const handleSignUp = async (email: string, password: string) => {
    console.log("Attempting signup for email:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email,
        }
      }
    });

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
    }

    toast.success("Conta criada com sucesso! Você já pode fazer login.", {
      duration: 4000
    });
    return true;
  };

  return {
    handleSignUp
  };
}