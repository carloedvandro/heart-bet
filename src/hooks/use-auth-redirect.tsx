import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Se não houver sessão e não estiver na página de login
        if (!session && location.pathname !== '/login') {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }

        // Se houver sessão e estiver na página de login
        if (session && location.pathname === '/login') {
          console.log('Session found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}