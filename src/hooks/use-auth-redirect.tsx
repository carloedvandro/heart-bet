import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        if (session) {
          console.log("User logged in, checking admin status");
          
          // Check if user is admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error checking admin status:", profileError);
            return;
          }

          if (profile?.is_admin) {
            console.log("Admin user detected, redirecting to admin dashboard");
            navigate("/admin");
          } else {
            console.log("Regular user detected, redirecting to user dashboard");
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "Session:", session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        
        // Check if user is admin
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error checking admin status:", profileError);
            return;
          }

          if (profile?.is_admin) {
            console.log("Admin user detected, redirecting to admin");
            navigate("/admin");
          } else {
            console.log("Regular user detected, redirecting to dashboard");
            navigate("/dashboard");
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Você foi desconectado");
        navigate("/login");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}