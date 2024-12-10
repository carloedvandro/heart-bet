import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthConfig() {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  const toggleView = () => {
    setView((prevView) => (prevView === "sign_in" ? "sign_up" : "sign_in"));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        toast.success("Login realizado com sucesso!");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Você foi desconectado");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated:", session?.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info("Verifique seu email para redefinir sua senha");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {view === "sign_in" ? "Bem-vindo de volta!" : "Crie sua conta"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {view === "sign_in"
            ? "Entre com suas credenciais para continuar"
            : "Preencha os dados abaixo para começar"}
        </p>
      </div>

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
              email_label: "E-mail",
              password_label: "Senha",
              button_label: "Entrar",
              loading_button_label: "Entrando...",
              email_input_placeholder: "Seu email",
              password_input_placeholder: "Sua senha",
              link_text: "",
            },
            sign_up: {
              email_label: "E-mail",
              password_label: "Senha",
              button_label: "Cadastrar",
              loading_button_label: "Cadastrando...",
              email_input_placeholder: "Seu email",
              password_input_placeholder: "Sua senha",
              confirmation_text: "Verifique seu email para confirmar o cadastro",
              link_text: "",
            },
            forgotten_password: {
              email_label: "E-mail",
              button_label: "Enviar instruções",
              loading_button_label: "Enviando instruções...",
              link_text: "Esqueceu sua senha?",
              confirmation_text: "Verifique seu email para redefinir sua senha",
            },
          },
        }}
        theme="light"
        providers={[]}
        magicLink={false}
        redirectTo={window.location.origin + "/dashboard"}
      />

      <div className="text-center mt-4">
        <p className="text-sm">
          {view === "sign_in" ? (
            <>
              Não tem uma conta?{" "}
              <span
                className="text-pink-500 cursor-pointer hover:underline"
                onClick={toggleView}
              >
                Cadastre-se
              </span>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <span
                className="text-pink-500 cursor-pointer hover:underline"
                onClick={toggleView}
              >
                Entre
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}