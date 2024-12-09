import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export function AuthConfig() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

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

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error("Erro ao tentar criar conta. Por favor, tente novamente.");
      } else {
        toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
        setIsSignUpMode(false);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Ocorreu um erro ao tentar criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`,
      });

      if (error) {
        console.error("Reset password error:", error);
        toast.error("Erro ao tentar resetar a senha. Por favor, tente novamente.");
      } else {
        toast.success("Se existe uma conta com este email, você receberá instruções para resetar sua senha.");
        setIsResetMode(false);
      }
    } catch (error) {
      console.error("Erro no reset de senha:", error);
      toast.error("Ocorreu um erro ao tentar resetar a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o email.");
      return;
    }

    if (!isResetMode && !password) {
      toast.error("Por favor, preencha a senha.");
      return;
    }

    if (isResetMode) {
      await handleResetPassword();
    } else if (isSignUpMode) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isResetMode 
            ? "Recuperar Senha" 
            : isSignUpMode 
              ? "Criar Conta" 
              : "Bem-vindo de volta!"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isResetMode 
            ? "Digite seu email para receber instruções"
            : isSignUpMode
              ? "Preencha seus dados para criar uma conta"
              : "Entre com suas credenciais para continuar"}
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
        
        {!isResetMode && (
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
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {isLoading ? (
            <span>
              {isResetMode 
                ? "Enviando..." 
                : isSignUpMode 
                  ? "Criando conta..." 
                  : "Entrando..."}
            </span>
          ) : (
            <span>
              {isResetMode 
                ? "Enviar instruções" 
                : isSignUpMode 
                  ? "Criar conta" 
                  : "Entrar"}
            </span>
          )}
        </button>
      </form>

      <div className="text-center mt-4 space-y-2">
        {!isResetMode && !isSignUpMode && (
          <p className="text-sm">
            Não tem uma conta?{" "}
            <span
              className="text-pink-500 cursor-pointer hover:underline"
              onClick={() => setIsSignUpMode(true)}
            >
              Cadastre-se
            </span>
          </p>
        )}

        <p className="text-sm">
          {isResetMode ? (
            <>
              Lembrou sua senha?{" "}
              <span
                className="text-pink-500 cursor-pointer hover:underline"
                onClick={() => setIsResetMode(false)}
              >
                Voltar ao login
              </span>
            </>
          ) : isSignUpMode ? (
            <>
              Já tem uma conta?{" "}
              <span
                className="text-pink-500 cursor-pointer hover:underline"
                onClick={() => setIsSignUpMode(false)}
              >
                Fazer login
              </span>
            </>
          ) : (
            <>
              Esqueceu sua senha?{" "}
              <span
                className="text-pink-500 cursor-pointer hover:underline"
                onClick={() => setIsResetMode(true)}
              >
                Recuperar senha
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}