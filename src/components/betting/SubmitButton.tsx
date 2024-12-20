import { Session } from "@supabase/supabase-js";
import { BetType } from "@/types/betting";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SubmitButtonProps {
  session: Session | null;
  selectedHearts: string[];
  mainHeart: string | null;
  betType: BetType;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SubmitButton = ({ session, selectedHearts, mainHeart, betType, isSubmitting }: SubmitButtonProps) => {
  const isValid = () => {
    console.log("🔍 Validando estado do botão:", {
      betType,
      mainHeart,
      selectedHearts,
      totalHearts: selectedHearts.length,
      hasMainHeart: Boolean(mainHeart)
    });

    if (!session) return false;
    if (isSubmitting) return false;

    if (betType === "simple_group") {
      return Boolean(mainHeart) && selectedHearts.length >= 2;
    }

    if (betType === "dozen") {
      return selectedHearts.length === 2;
    }

    if (betType === "hundred") {
      return selectedHearts.length === 3;
    }

    return selectedHearts.length === 4;
  };

  const getButtonText = () => {
    if (isSubmitting) return "Processando...";
    if (!session) return "Faça login para apostar";
    
    if (!isValid()) {
      if (betType === "simple_group") {
        if (!mainHeart) return "Selecione 1 coração principal";
        if (selectedHearts.length === 1) return "Selecione pelo menos 1 par";
      } else if (betType === "dozen") {
        return `Selecione ${2 - selectedHearts.length} coração(ões)`;
      } else if (betType === "hundred") {
        return `Selecione ${3 - selectedHearts.length} coração(ões)`;
      } else {
        return `Selecione ${4 - selectedHearts.length} coração(ões)`;
      }
    }
    
    return "Sistema em Manutenção";
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-center font-medium">
          Sistema temporariamente em manutenção para melhorias. Por favor, aguarde alguns instantes.
        </AlertDescription>
      </Alert>

      <button
        disabled={true}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500
                 text-white rounded-full shadow-lg
                 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 w-full text-center"
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default SubmitButton;