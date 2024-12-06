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
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Verify if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // If no profile exists, create one
        if (!profile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
              }
            ]);

          if (createError) {
            console.error("Error creating profile:", createError);
            toast.error("Erro ao criar perfil. Por favor, tente novamente.");
            return;
          }
        }

        // Navigate to dashboard after ensuring profile exists
        navigate("/");
      }
    };

    checkSession();
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