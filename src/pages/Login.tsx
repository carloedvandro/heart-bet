import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { AuthConfig } from "@/components/auth/AuthConfig";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          console.log("Session found, checking profile for user:", session.user.id);
          
          // First check if profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error checking profile:", profileError);
            toast.error("Erro ao verificar perfil");
            return;
          }

          // If no profile exists, create one
          if (!existingProfile) {
            console.log("No profile found, creating new profile for user:", session.user.id);
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  is_admin: false, // explicitly set default value
                  balance: 0 // set initial balance
                }
              ]);

            if (createError) {
              console.error("Error creating profile:", createError);
              toast.error("Erro ao criar perfil");
              return;
            }
            console.log("Profile created successfully");
          } else {
            console.log("Existing profile found");
          }

          // Navigate to dashboard after ensuring profile exists
          console.log("Navigating to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Erro inesperado ao verificar sessão");
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        checkSession();
      }
    });

    // Check session on component mount
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <Card className="w-full max-w-md relative z-10 bg-white/95">
        <LoginHeader />
        <CardContent>
          <AuthConfig />
        </CardContent>
      </Card>
    </div>
  );
}