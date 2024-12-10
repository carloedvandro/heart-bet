import { useState } from "react";
import { AuthForm } from "./AuthForm";
import { AuthLinks } from "./AuthLinks";
import { useAuthHandlers } from "./hooks/useAuthHandlers";
import { toast } from "sonner";

export function AuthConfig() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const { isLoading, handleSignIn, handleSignUp, handleResetPassword } = useAuthHandlers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário submetido", { email, isResetMode, isSignUpMode });

    if (!email) {
      toast.error("Por favor, preencha o email.");
      return;
    }

    if (!isResetMode && !password) {
      toast.error("Por favor, preencha a senha.");
      return;
    }

    try {
      if (isResetMode) {
        const success = await handleResetPassword(email);
        if (success) {
          setIsResetMode(false);
          setEmail("");
        }
      } else if (isSignUpMode) {
        const success = await handleSignUp(email, password);
        if (success) {
          setIsSignUpMode(false);
          setEmail("");
          setPassword("");
        }
      } else {
        console.log("Tentando login com:", { email });
        const success = await handleSignIn(email, password);
        if (success) {
          setEmail("");
          setPassword("");
        } else {
          console.log("Login falhou, mantendo dados do formulário");
        }
      }
    } catch (error) {
      console.error("Erro detalhado no submit do formulário:", error);
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white/95 rounded-lg shadow-xl backdrop-blur-sm">
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

      <AuthForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        isResetMode={isResetMode}
        isSignUpMode={isSignUpMode}
        onSubmit={handleSubmit}
      />

      <AuthLinks 
        isResetMode={isResetMode}
        isSignUpMode={isSignUpMode}
        onResetMode={setIsResetMode}
        onSignUpMode={setIsSignUpMode}
      />
    </div>
  );
}