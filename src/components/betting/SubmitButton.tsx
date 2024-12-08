import { Session } from "@supabase/supabase-js";
import { BetType } from "@/types/betting";

interface SubmitButtonProps {
  session: Session | null;
  selectedHearts: string[];
  mainHeart: string | null;
  betType: BetType;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SubmitButton = ({ session, selectedHearts, mainHeart, betType, isSubmitting, onSubmit }: SubmitButtonProps) => {
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
    
    return "Confirmar Aposta";
  };

  return (
    <button
      onClick={onSubmit}
      disabled={!isValid()}
      className="mt-8 px-8 py-3 bg-gradient-to-r from-heart-pink to-heart-purple
               text-white rounded-full shadow-lg hover:shadow-xl
               transition-all duration-300 transform hover:scale-105
               disabled:opacity-50 disabled:cursor-not-allowed
               disabled:hover:scale-100 disabled:hover:shadow-lg"
    >
      {getButtonText()}
    </button>
  );
};

export default SubmitButton;