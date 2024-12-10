import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResetPassword() {
  const handleResetPassword = async (email: string) => {
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um email válido.");
      return false;
    }

    console.log("Tentando resetar senha para o email:", email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });

    if (error) {
      console.error("Erro detalhado no reset de senha:", error);

      if (error.status === 429) {
        toast.error("Limite de emails excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
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
  };

  return {
    handleResetPassword
  };
}