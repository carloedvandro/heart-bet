import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AuthConfig } from "@/components/auth/AuthConfig";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login component mounted");
    
    const checkSession = async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          console.log("Valid session found, checking profile for user:", session.user.id);
          
          // Add a delay to ensure auth record is fully created
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error checking profile:", profileError);
            toast.error("Erro ao verificar perfil");
            return;
          }

          // If profile exists or we're waiting for the trigger to create it, proceed to dashboard
          console.log("Profile check complete, navigating to dashboard");
          navigate('/dashboard', { replace: true });
        } else {
          console.log("No valid session found");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Erro inesperado ao verificar sessão");
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, staying on login page");
        // Clear any local storage data to prevent stale tokens
        localStorage.removeItem('supabase.auth.token');
        window.location.reload(); // Force a clean reload of the page
      } else if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      {/* Animated overlay with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-gradient-x"
        style={{
          animation: 'gradient 15s ease infinite',
        }}
      />
      
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      
      {/* Floating hearts effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${6 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.3 + Math.random() * 0.4,
              transform: `scale(${0.5 + Math.random() * 0.5})`,
            }}
          >
            <Heart 
              className="text-heart-pink animate-heart-beat" 
              size={24 + Math.random() * 12}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg animate-fade-in">
            Loto Corações Premiados
          </h1>
          <p className="text-white/90 mt-2 text-lg drop-shadow animate-fade-in-delayed">
            Aposte com o coração
          </p>
        </div>
        <Card className="bg-white/95 animate-fade-in-up">
          <CardContent className="pt-6 relative">
            <AuthConfig />
            <div className="text-center mt-4">
              <p className="text-xs text-gray-400 opacity-70">
                created by Lovablebr.dev
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}