import { toast } from "sonner";
import { BetType, MAX_SELECTIONS } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";

export const useHeartSelection = (
  betType: BetType,
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: (hearts: string[]) => void
) => {
  const handleHeartClick = (color: string) => {
    if (betType === "simple_group") {
      // Se ainda não temos um coração principal
      if (!mainHeart) {
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha 4 corações diferentes para formar os pares");
        return;
      }

      // Se já temos o coração principal
      if (color === mainHeart) {
        playSounds.error();
        toast.error("Escolha um coração diferente do principal para formar o par");
        return;
      }

      setSelectedHearts((prev) => {
        // Se o coração já foi selecionado como par
        if (prev.includes(color)) {
          return prev.filter((c) => c !== color);
        }

        // Contando quantos pares já foram formados (excluindo o coração principal)
        const pairsCount = prev.filter(c => c !== mainHeart).length;

        if (pairsCount >= 4) {
          playSounds.error();
          toast.error("Você já selecionou todos os pares necessários");
          return prev;
        }

        return [...prev, color];
      });
    } else {
      setSelectedHearts((prev) => {
        if (prev.includes(color)) {
          return prev.filter((c) => c !== color);
        }
        if (prev.length >= MAX_SELECTIONS[betType]) {
          playSounds.error();
          toast.error(`Máximo de ${MAX_SELECTIONS[betType]} ${betType === "simple_group" ? "coração" : "corações"} para este tipo de aposta`);
          return prev;
        }
        return [...prev, color];
      });
    }
  };

  return { handleHeartClick };
};