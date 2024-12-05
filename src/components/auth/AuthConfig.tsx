import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function AuthConfig() {
  return (
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
    />
  );
}