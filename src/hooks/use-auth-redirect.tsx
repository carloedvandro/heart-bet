import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

        // Se não houver sessão e não estiver na página de login
        if (!session && location.pathname !== '/login') {
          navigate('/login');
          return;
        }

        // Se houver sessão e estiver na página de login
        if (session && location.pathname === '/login') {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}