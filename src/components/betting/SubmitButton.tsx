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
    if (!session) return false;
    if (isSubmitting) return false;

    if (betType === "simple_group") {
      // Validate main heart
      if (!mainHeart) return false;

      // Filter valid pairs (excluding main heart)
      const pairs = selectedHearts.filter((heart) => heart !== mainHeart);

      // We need exactly 4 pairs to enable the button
      return pairs.length === 4;
    }

    // Logic for other bet types
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