import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isSubscribed = true;

    const checkSession = async () => {
      try {
        console.log("Verificando sessão...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isSubscribed) return;

        if (!session && location.pathname !== '/login') {
          console.log("Sem sessão ativa, redirecionando para login");
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isSubscribed) return;
      
      console.log("Evento de autenticação:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogado, redirecionando para login");
        navigate('/login', { replace: true });
      }
    });

    return () => {
      console.log("Limpando inscrição de auth redirect");
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}