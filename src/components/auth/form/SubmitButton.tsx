import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  isResetMode: boolean;
  isSignUpMode: boolean;
}

export function SubmitButton({ isLoading, isResetMode, isSignUpMode }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full"
      variant="default"
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
    </Button>
  );
}