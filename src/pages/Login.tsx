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
    let isSubscribed = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !isSubscribed) {
          console.log("No valid session, staying on login page");
          return;
        }

        console.log("Valid session found, checking profile for user:", session.user.id);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error checking profile:", profileError);
          toast.error("Erro ao verificar perfil");
          return;
        }

        if (profile && isSubscribed) {
          console.log("Profile found, navigating to dashboard");
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Erro inesperado ao verificar sessão");
      }
    };

    checkSession();

    return () => {
      isSubscribed = false;
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