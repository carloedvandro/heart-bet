import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  isResetMode: boolean;
  isSignUpMode: boolean;
}

export function SubmitButton({ isLoading, isResetMode, isSignUpMode }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Aguarde...
        </>
      ) : isResetMode ? (
        "Enviar instruções"
      ) : isSignUpMode ? (
        "Criar conta"
      ) : (
        "Entrar"
      )}
    </Button>
  );
}