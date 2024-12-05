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
    // Verificar se há um hash de confirmação na URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get("error");
    const errorDescription = hashParams.get("error_description");

    if (error) {
      if (error === "invalid_credentials") {
        toast.error("Email ou senha incorretos. Por favor, verifique suas credenciais.");
      } else {
        toast.error(errorDescription || "Erro na autenticação");
      }
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (session) {
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Você foi desconectado");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Bem-vindo ao Lotocoração</CardTitle>
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
                },
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                  social_provider_text: "Entrar com {{provider}}",
                  link_text: "Já tem uma conta? Entre",
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