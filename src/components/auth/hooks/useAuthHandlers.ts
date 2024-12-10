import { useState } from "react";
import { useSignIn } from "./useSignIn";
import { useSignUp } from "./useSignUp";
import { useResetPassword } from "./useResetPassword";

export function useAuthHandlers() {
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();
  const signUp = useSignUp();
  const resetPassword = useResetPassword();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signIn.handleSignIn(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const success = await signUp.handleSignUp(email, password);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setIsLoading(true);
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