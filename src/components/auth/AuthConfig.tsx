import { useState } from "react";
import { AuthForm } from "./AuthForm";
import { AuthLinks } from "./AuthLinks";
import { useAuthHandlers } from "./hooks/useAuthHandlers";
import { toast } from "@/hooks/use-toast";

export function AuthConfig() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const { isLoading, handleSignIn, handleSignUp, handleResetPassword } = useAuthHandlers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha o email."
      });
      return;
    }

    if (!isResetMode && !password) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha a senha."
      });
      return;
    }

    if (isResetMode) {
      const success = await handleResetPassword(email);
      if (success) {
        setIsResetMode(false);
      }
    } else if (isSignUpMode) {
      const success = await handleSignUp(email, password);
      if (success) {
        setIsSignUpMode(false);
      }
    } else {
      await handleSignIn(email, password);
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