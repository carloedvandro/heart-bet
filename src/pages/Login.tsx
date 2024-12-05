import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
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
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Você foi desconectado");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated:", session?.user);
      }
    });

    checkUser();

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
        <CardHeader className="space-y-2">
          <h2 className="text-center text-lg text-gray-600">Bem-vindo</h2>
          <CardTitle className="text-center text-2xl font-bold">Loto Corações Premiados</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF69B4',
                    brandAccent: '#FF1493',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Cadastrar",
                  loading_button_label: "Cadastrando...",
                  social_provider_text: "Entrar com {{provider}}",
                  link_text: "Não tem uma conta? Cadastre-se",
                  email_input_placeholder: "Seu email",
                  password_input_placeholder: "Sua senha",
                },
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                  social_provider_text: "Entrar com {{provider}}",
                  link_text: "Já tem uma conta? Entre",
                  email_input_placeholder: "Seu email",
                  password_input_placeholder: "Sua senha",
                },
                forgotten_password: {
                  link_text: "Esqueceu sua senha?",
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Enviar instruções",
                  loading_button_label: "Enviando instruções...",
                  confirmation_text: "Verifique seu email para redefinir sua senha",
                },
              },
              messages: {
                sign_in: {
                  invalid_credentials: "Email ou senha incorretos",
                  email_not_confirmed: "Por favor, confirme seu email antes de entrar",
                  password_recovery_email_sent: "Email de recuperação de senha enviado",
                },
                sign_up: {
                  email_already_exists: "Email já cadastrado",
                  invalid_email: "Email inválido",
                  weak_password: "Senha muito fraca",
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}