import { toast } from "sonner";
import { BetType } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";

export const useHeartSelection = (
  betType: BetType,
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const handleHeartClick = (color: string) => {
    if (betType === "simple_group") {
      // Se ainda não temos um coração principal
      if (!mainHeart) {
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha 4 corações para formar os pares");
        return;
      }

      // Se já temos o coração principal, permitimos selecionar qualquer coração (incluindo o mesmo)
      const pairsCount = selectedHearts.filter(c => c !== mainHeart).length;

      if (pairsCount >= 4) {
        if (!selectedHearts.includes(color)) {
          playSounds.error();
          toast.error("Você já selecionou todos os pares necessários");
          return;
        }
        // Permite remover um coração já selecionado
        setSelectedHearts(prev => prev.filter(c => c !== color));
        return;
      }

      // Adiciona o coração selecionado aos pares (permite repetição)
      if (color === mainHeart || !selectedHearts.includes(color)) {
        setSelectedHearts(prev => [...prev, color]);
      } else {
        setSelectedHearts(prev => prev.filter(c => c !== color));
      }
    } else {
      // Lógica para outros tipos de apostas
      setSelectedHearts(prev => {
        if (prev.includes(color)) {
          return prev.filter(c => c !== color);
        }
        if (prev.length >= 4) {
          playSounds.error();
          toast.error("Máximo de 4 corações para este tipo de aposta");
          return prev;
        }
        return [...prev, color];
      });
    }
  };

  return { handleHeartClick };
};