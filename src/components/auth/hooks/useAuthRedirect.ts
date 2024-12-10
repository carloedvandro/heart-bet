import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const checkSession = async () => {
      try {
        console.log("Verificando sessão atual:", {
          sessionExists: !!(await supabase.auth.getSession()).data.session,
          userId: (await supabase.auth.getSession()).data.session?.user?.id,
          currentPath: location.pathname
        });

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isSubscribed) return;

        if (!session && location.pathname !== '/login') {
          console.log("No session found in Dashboard, redirecting to login");
          navigate('/login', { replace: true });
        } else if (session && location.pathname === '/login') {
          console.log("Sessão ativa encontrada, redirecionando para dashboard");
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        if (isSubscribed) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isSubscribed) return;
      
      console.log("Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session && location.pathname === '/login') {
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT' && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      console.log("Limpando inscrição de auth redirect");
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return { isCheckingSession };
}