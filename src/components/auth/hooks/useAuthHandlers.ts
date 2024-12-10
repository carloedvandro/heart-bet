import { useSignIn } from "./useSignIn";
import { useSignUp } from "./useSignUp";
import { useResetPassword } from "./useResetPassword";

export function useAuthHandlers() {
  const { isLoading: isSignInLoading, handleSignIn } = useSignIn();
  const { isLoading: isSignUpLoading, handleSignUp } = useSignUp();
  const { isLoading: isResetLoading, handleResetPassword } = useResetPassword();

  const isLoading = isSignInLoading || isSignUpLoading || isResetLoading;

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleResetPassword,
  };
}