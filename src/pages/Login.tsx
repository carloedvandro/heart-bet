import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard");
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
          />
        </CardContent>
      </Card>
    </div>
  );
}