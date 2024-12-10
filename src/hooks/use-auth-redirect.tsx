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
        
        if (!session && location.pathname !== '/login') {
          console.log("No session found, redirecting to login");
          navigate('/login', { replace: true });
          return;
        }

        if (session && (location.pathname === '/login' || location.pathname === '/')) {
          console.log("Session found on login/index page, redirecting to dashboard");
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isSubscribed) return;
      
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        navigate('/login', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
}