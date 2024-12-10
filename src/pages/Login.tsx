import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Iniciando tentativa de login para:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login.");
        } else {
          toast.error("Erro ao tentar fazer login.");
        }
        return;
      }

      if (data?.session) {
        console.log("Login bem sucedido, redirecionando...");
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-gradient-x" />
      
      {/* Overlay escuro com blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <div className="w-full max-w-md bg-white/95 rounded-lg shadow-xl backdrop-blur-sm p-6 relative z-10">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Bem-vindo de volta!
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Entre com suas credenciais para continuar
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold transition-all duration-200 ${
              isLoading 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Não tem uma conta?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-pink-600 hover:text-pink-700 hover:underline font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;