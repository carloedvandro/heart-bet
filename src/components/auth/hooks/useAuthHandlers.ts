import { useState } from "react";
import { useSignIn } from "./useSignIn";
import { useSignUp } from "./useSignUp";
import { useResetPassword } from "./useResetPassword";

export function useAuthHandlers() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSignIn } = useSignIn();
  const { handleSignUp } = useSignUp();
  const { handleResetPassword } = useResetPassword();

  const handleAuthAction = async (
    action: "signIn" | "signUp" | "reset",
    email: string,
    password?: string
  ) => {
    try {
      setIsLoading(true);
      switch (action) {
        case "signIn":
          if (!password) throw new Error("Password required for sign in");
          return await handleSignIn(email, password);
        case "signUp":
          if (!password) throw new Error("Password required for sign up");
          return await handleSignUp(email, password);
        case "reset":
          return await handleResetPassword(email);
        default:
          throw new Error("Invalid action");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn: (email: string, password: string) => 
      handleAuthAction("signIn", email, password),
    handleSignUp: (email: string, password: string) => 
      handleAuthAction("signUp", email, password),
    handleResetPassword: (email: string) => 
      handleAuthAction("reset", email)
  };
}