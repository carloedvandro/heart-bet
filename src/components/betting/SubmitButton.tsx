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
      hasMainHeart: Boolean(mainHeart),
      pairsCount: selectedHearts.length - (mainHeart ? 1 : 0)
    });

    if (!session) return false;
    if (isSubmitting) return false;

    if (betType === "simple_group") {
      // Para grupo simples, precisamos de:
      // 1. Um coração principal selecionado
      // 2. Exatamente 4 pares (que podem ser gerados automaticamente)
      return Boolean(mainHeart) && selectedHearts.length === 5; // Principal + 4 pares = 5 corações
    }

    // Para outros tipos de aposta
    return selectedHearts.length === 4;
  };

  const getButtonText = () => {
    if (isSubmitting) return "Processando...";
    if (!session) return "Faça login para apostar";
    
    if (!isValid()) {
      if (betType === "simple_group") {
        if (!mainHeart) return "Selecione 1 coração principal";
        
        const totalSelected = selectedHearts.length;
        const pairsNeeded = 4 - (totalSelected - 1);
        
        if (totalSelected === 1) return "Selecione 4 pares";
        if (pairsNeeded > 0) return `Selecione mais ${pairsNeeded} par(es)`;
        if (totalSelected > 5) return "Remova alguns pares (máximo 4)";
      } else {
        return "Selecione 4 corações";
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