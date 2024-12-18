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
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Profile error:", profileError);
            // If profile doesn't exist, create it
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

          console.log("User already logged in, redirecting to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Você foi desconectado");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated:", session?.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info("Verifique seu email para redefinir sua senha");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}