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
    });

    if (!session) return false;
    if (isSubmitting) return false;

    if (betType === "simple_group") {
      // Para grupo simples, precisamos de exatamente 2 corações:
      // 1 principal e 1 para formar o par
      return mainHeart && selectedHearts.length === 1;
    }

    // Para outros tipos de aposta
    return selectedHearts.length === 4;
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
      {isSubmitting ? (
        "Processando..."
      ) : !session ? (
        "Faça login para apostar"
      ) : !isValid() ? (
        betType === "simple_group" 
          ? "Selecione 1 coração principal e 1 par" 
          : "Selecione 4 corações"
      ) : (
        "Confirmar Aposta"
      )}
    </button>
  );
};

export default SubmitButton;