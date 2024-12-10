import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isSubscribed = true;

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Verificando sessão atual:", {
          sessionExists: !!session,
          userId: session?.user?.id,
          currentPath: location.pathname
        });
        
        if (!session && location.pathname !== '/login') {
          console.log("Sem sessão ativa, redirecionando para login");
          navigate('/login', { replace: true });
          return;
        }

        if (session && location.pathname === '/login') {
          console.log("Sessão ativa encontrada, redirecionando para dashboard");
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isSubscribed) return;
      
      console.log("Mudança no estado de autenticação:", {
        event,
        userId: session?.user?.id,
        currentPath: location.pathname
      });
      
      if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogado, redirecionando para login");
        navigate('/login', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        console.log("Usuário logado, redirecionando para dashboard");
        navigate('/dashboard', { replace: true });
      }
    });

    return () => {
      console.log("Limpando inscrição de auth redirect");
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}