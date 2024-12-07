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
    console.log("🔍 Validating button state:", {
      betType,
      mainHeart,
      selectedHearts,
      totalHearts: selectedHearts.length
    });

    if (!session) return false;
    if (isSubmitting) return false;

    if (betType === "simple_group") {
      // For simple_group, we need exactly 5 hearts total (1 main + 4 pairs)
      if (!mainHeart) return false;
      return selectedHearts.length === 5;
    }

    // For other bet types
    return selectedHearts.length === 4;
  };

  return (
    <button
      onClick={onSubmit}
      disabled={!isValid()}
      className="mt-8 px-8 py-3 bg-gradient-to-r from-heart-pink to-heart-purple
               text-white rounded-full shadow-lg hover:shadow-xl
               transition-all duration-300 transform hover:scale-105
               disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Processando..." : session ? "Confirmar Aposta" : "Faça login para apostar"}
    </button>
  );
};

export default SubmitButton;