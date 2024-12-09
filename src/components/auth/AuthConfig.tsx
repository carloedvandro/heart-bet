import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function AuthConfig() {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <div className="space-y-6">
      {view === "sign_up" && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Tela de Cadastro</h2>
          <p className="text-gray-600">
            Cadastre um email e uma senha para se tornar membro de nossa comunidade
          </p>
        </div>
      )}
      
      {view === "sign_in" && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo de volta!</h2>
          <p className="text-gray-600">
            Entre com seu email e senha para acessar sua conta
          </p>
        </div>
      )}

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
              confirmation_text: "Verifique seu email"
            },
            sign_in: {
              email_label: "Email",
              password_label: "Senha",
              button_label: "Entrar",
              loading_button_label: "Entrando...",
              social_provider_text: "Entrar com {{provider}}",
              link_text: "Já tem uma conta? Entre",
              email_input_placeholder: "Seu email",
              password_input_placeholder: "Sua senha"
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
        onViewChange={(newView) => setView(newView as "sign_in" | "sign_up")}
      />
    </div>
  );
}