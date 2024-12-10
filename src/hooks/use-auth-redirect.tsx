import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking user session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        if (session) {
          console.log("Session found, user ID:", session.user.id);
          
          // Check if user is admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error checking admin status:", profileError);
            return;
          }

          console.log("Profile data:", profile);

          if (profile?.is_admin) {
            console.log("Admin user detected, redirecting to admin dashboard");
            navigate("/admin");
          } else {
            console.log("Regular user detected, redirecting to user dashboard");
            navigate("/dashboard");
          }
        } else {
          console.log("No session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, checking admin status");
        
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error checking admin status:", profileError);
            return;
          }

          console.log("Profile data after sign in:", profile);

          if (profile?.is_admin) {
            console.log("Admin user confirmed, navigating to admin");
            navigate("/admin");
          } else {
            console.log("Regular user confirmed, navigating to dashboard");
            navigate("/dashboard");
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Você foi desconectado");
        navigate("/login");
      }
    });

    // Check user status on component mount
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}