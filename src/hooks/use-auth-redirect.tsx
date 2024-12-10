import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Verificando sessão do usuário...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro na sessão:", sessionError);
          return;
        }
        
        if (session) {
          console.log("Sessão encontrada, ID do usuário:", session.user.id);
          
          // Verificar se o usuário é admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Erro ao verificar status de admin:", profileError);
            return;
          }

          console.log("Dados do perfil:", profile);

          // Só redireciona se o usuário não estiver em uma rota válida
          if (location.pathname === '/login' || location.pathname === '/') {
            if (profile?.is_admin === true) {
              console.log("Usuário admin detectado, redirecionando para painel admin");
              navigate("/admin");
            } else {
              console.log("Usuário comum detectado, redirecionando para dashboard");
              navigate("/dashboard");
            }
          }
        } else {
          console.log("Nenhuma sessão encontrada");
          // Se não houver sessão e não estiver na página de login, redireciona
          if (location.pathname !== '/login') {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("Usuário logado, verificando status de admin");
        
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Erro ao verificar status de admin:", profileError);
            return;
          }

          console.log("Dados do perfil após login:", profile);

          if (profile?.is_admin === true) {
            console.log("Usuário admin confirmado, navegando para admin");
            navigate("/admin");
            toast.success("Bem-vindo ao painel administrativo!");
          } else {
            console.log("Usuário comum confirmado, navegando para dashboard");
            navigate("/dashboard");
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogado");
        toast.info("Você foi desconectado");
        navigate("/login");
      }
    });

    // Verificar status do usuário ao montar o componente
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}