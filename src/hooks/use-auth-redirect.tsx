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

        // Se não houver sessão
        if (!session) {
          // Se estiver tentando acessar área administrativa
          if (location.pathname.startsWith('/admin')) {
            console.log("Sem sessão, redirecionando para login admin");
            navigate('/admin-login');
            return;
          }
          
          // Se estiver tentando acessar área de usuário
          if (location.pathname !== '/login' && location.pathname !== '/admin-login') {
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

        // Lógica para usuários administrativos
        if (profile?.is_admin) {
          console.log("Usuário admin detectado, verificando rota:", location.pathname);
          
          // Se admin estiver em páginas de login, redirecionar para admin
          if (location.pathname === '/admin-login' || location.pathname === '/login') {
            navigate('/admin');
            return;
          }
          
          // Se admin estiver em páginas de usuário comum, redirecionar para admin
          if (!location.pathname.startsWith('/admin')) {
            console.log("Admin tentando acessar área de usuário, redirecionando para /admin");
            toast.error("Administradores devem usar o painel administrativo");
            navigate('/admin');
            return;
          }

          // Se admin estiver em rotas administrativas válidas, permitir
          if (location.pathname === '/admin' || location.pathname === '/admin/bets') {
            console.log("Admin acessando rota administrativa válida:", location.pathname);
            return;
          }

          // Se admin estiver em qualquer outra rota administrativa inválida, redirecionar para /admin
          if (location.pathname.startsWith('/admin')) {
            navigate('/admin');
            return;
          }
        }

        // Lógica para usuários comuns
        if (!profile?.is_admin) {
          // Se usuário comum tentar acessar área admin
          if (location.pathname.startsWith('/admin')) {
            toast.error("Acesso não autorizado");
            navigate('/dashboard');
            return;
          }

          // Se usuário comum estiver na página de login
          if (location.pathname === '/login') {
            navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Verificar se estava na área administrativa
        if (location.pathname.startsWith('/admin')) {
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