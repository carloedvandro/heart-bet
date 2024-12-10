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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro na sessão:", sessionError);
          return;
        }

        // Se não houver sessão e estiver tentando acessar uma rota protegida
        if (!session) {
          if (location.pathname === '/admin') {
            navigate('/admin-login');
          } else if (location.pathname !== '/login' && location.pathname !== '/admin-login') {
            navigate('/login');
          }
          return;
        }

        // Se houver sessão, verificar o tipo de usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao verificar perfil:", profileError);
          return;
        }

        // Se for admin na página de login admin ou login comum, redirecionar para admin
        if (profile?.is_admin && (location.pathname === '/admin-login' || location.pathname === '/login')) {
          navigate('/admin');
          return;
        }

        // Se não for admin tentando acessar área admin, redirecionar para dashboard
        if (!profile?.is_admin && location.pathname === '/admin') {
          toast.error("Acesso não autorizado");
          navigate('/dashboard');
          return;
        }

        // Se for usuário comum na página de login, redirecionar para dashboard
        if (!profile?.is_admin && location.pathname === '/login') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    // Verificar status do usuário ao montar o componente e quando a rota mudar
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (location.pathname === '/admin') {
          navigate('/admin-login');
        } else {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}