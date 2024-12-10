import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentando login administrativo para:", email);

      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Erro no login:", signInError);
        
        switch (signInError.message) {
          case "Invalid login credentials":
            toast.error("Credenciais inválidas");
            break;
          case "Email not confirmed":
            toast.error("Email não confirmado");
            break;
          default:
            toast.error("Erro ao fazer login");
        }
        return;
      }

      if (session) {
        // Verificar se o usuário é admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao verificar status de admin:", profileError);
          toast.error("Erro ao verificar permissões");
          await supabase.auth.signOut();
          return;
        }

        if (!profile?.is_admin) {
          toast.error("Acesso não autorizado");
          await supabase.auth.signOut();
          return;
        }

        // Se chegou aqui, é um admin válido
        toast.success("Login realizado com sucesso!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAdminSignIn,
  };
}