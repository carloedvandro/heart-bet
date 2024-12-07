import { toast } from "sonner";
import { BetType } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

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

      // Se já temos o coração principal
      const selectedPairs = selectedHearts.filter(c => c !== mainHeart);
      const pairsCount = selectedPairs.length;

      // Se já selecionou todos os pares necessários
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

      // Verifica se o par já existe
      const existingPairs = selectedPairs.map(pairColor => {
        const mainNumber = getNumberForHeart(mainHeart);
        const pairNumber = getNumberForHeart(pairColor);
        return mainNumber < pairNumber 
          ? `${mainNumber}${pairNumber}` 
          : `${pairNumber}${mainNumber}`;
      });

      // Verifica se o novo par já existe
      const mainNumber = getNumberForHeart(mainHeart);
      const newPairNumber = getNumberForHeart(color);
      const newPair = mainNumber < newPairNumber 
        ? `${mainNumber}${newPairNumber}` 
        : `${newPairNumber}${mainNumber}`;

      if (existingPairs.includes(newPair)) {
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Adiciona o novo par
      setSelectedHearts(prev => [...prev, color]);
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