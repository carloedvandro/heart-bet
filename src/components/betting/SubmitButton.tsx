import { Session } from "@supabase/supabase-js";
import { MAX_SELECTIONS, BetType } from "@/types/betting";

interface SubmitButtonProps {
  session: Session | null;
  selectedHearts: string[];
  betType: BetType;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SubmitButton = ({ session, selectedHearts, betType, isSubmitting, onSubmit }: SubmitButtonProps) => {
  return (
    <button
      onClick={onSubmit}
      disabled={!session || selectedHearts.length !== MAX_SELECTIONS[betType] || isSubmitting}
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