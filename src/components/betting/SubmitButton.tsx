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
      // Verifica se temos um coração principal
      if (!mainHeart) return false;
      
      // Filtra os pares (excluindo o coração principal)
      const pairs = selectedHearts.filter(heart => heart !== mainHeart);
      return pairs.length === 4;
    }

    // Para outros tipos de aposta, mantemos a lógica original
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