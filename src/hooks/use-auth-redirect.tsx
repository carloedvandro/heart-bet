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
          // Clear potentially corrupted session data
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.refreshToken');
          navigate('/login');
          return;
        }
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate('/login');
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile error:", profileError);
          if (profileError.message?.includes('JSON object requested, multiple (or no) rows returned')) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  balance: 0,
                  is_admin: false
                }
              ]);

            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast.error("Erro ao criar perfil");
              return;
            }
          }
        }

        console.log("User authenticated, redirecting to dashboard");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error checking session:", error);
        toast.error("Erro ao verificar sessão");
        navigate('/login');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "Session:", session ? "exists" : "none");
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        await checkUser();
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Você foi desconectado");
        navigate('/login');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated:", session?.user);
      }
    });

    // Initial check
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}