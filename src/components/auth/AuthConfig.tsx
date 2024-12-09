import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function AuthConfig() {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setView("sign_in");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Auth
        supabaseClient={supabase}
        view={view}
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
          className: {
            container: "space-y-4",
            label: "text-gray-700 font-medium",
            button: "w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded transition-colors",
            input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500",
            anchor: "text-gray-600 hover:text-pink-600 transition-colors",
            message: "text-sm text-gray-600",
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              password_label: "Senha",
              button_label: "Entrar",
              loading_button_label: "Entrando...",
              social_provider_text: "Entrar com {{provider}}",
              link_text: "Não tem uma conta? Cadastre-se",
              email_input_placeholder: "Seu email",
              password_input_placeholder: "Sua senha",
              forgotten_password_label: "Esqueceu sua senha?"
            },
            sign_up: {
              email_label: "Email",
              password_label: "Senha",
              button_label: "Cadastrar",
              loading_button_label: "Cadastrando...",
              social_provider_text: "Cadastrar com {{provider}}",
              link_text: "Já tem uma conta? Entre",
              email_input_placeholder: "Seu email",
              password_input_placeholder: "Sua senha",
              confirmation_text: "Verifique seu email",
            },
            forgotten_password: {
              link_text: "Esqueceu sua senha?",
              email_label: "Email",
              password_label: "Senha",
              button_label: "Enviar instruções",
              loading_button_label: "Enviando instruções...",
              confirmation_text: "Verifique seu email para redefinir sua senha"
            }
          }
        }}
        theme="light"
        providers={[]}
        magicLink={false}
        redirectTo={window.location.origin + "/dashboard"}
      />
    </div>
  );
}