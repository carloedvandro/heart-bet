import { useState } from "react";
import { useSignIn } from "./useSignIn";
import { useSignUp } from "./useSignUp";
import { useResetPassword } from "./useResetPassword";
import { toast } from "sonner";

export function useAuthHandlers() {
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();
  const signUp = useSignUp();
  const resetPassword = useResetPassword();

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Por favor, preencha email e senha");
      return false;
    }

    setIsLoading(true);
    try {
      console.log("Tentando login com:", { email });
      const success = await signIn.handleSignIn(email, password);
      return success;
    } catch (error) {
      console.error("Erro detalhado no handleSignIn:", error);
      toast.error("Erro ao tentar fazer login. Por favor, tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await signUp.handleSignUp(email, password);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const success = await resetPassword.handleResetPassword(email);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleResetPassword,
  };
}