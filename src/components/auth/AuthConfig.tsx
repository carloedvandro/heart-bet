import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export function AuthConfig() {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleView = () => {
    setView((prevView) => (prevView === "sign_in" ? "sign_up" : "sign_in"));
    setEmail("");
    setPassword("");
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Check if error indicates user already exists
        if (error.status === 422 && error.message.includes("already registered")) {
          toast.error("Este email já está registrado. Por favor, faça login.");
          setView("sign_in");
          return;
        }
        
        toast.error("Erro ao tentar cadastrar. Por favor, tente novamente.");
      } else {
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Ocorreu um erro ao tentar cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error);
        
        if (error.status === 400 && error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos.");
          return;
        }
        
        toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Ocorreu um erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (view === "sign_in") {
      await handleSignIn();
    } else {
      await handleSignUp();
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {isLoading ? (
            <span>
              {view === "sign_in" ? "Entrando..." : "Cadastrando..."}
            </span>
          ) : (
            <span>
              {view === "sign_in" ? "Entrar" : "Cadastrar"}
            </span>
          )}
        </button>
      </form>

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