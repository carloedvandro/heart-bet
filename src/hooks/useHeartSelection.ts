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
    console.log("🎯 Heart clicked:", color);
    console.log("📍 Current state:", {
      betType,
      mainHeart,
      selectedHearts,
      selectedHeartCount: selectedHearts.length
    });

    if (betType === "simple_group") {
      // Se ainda não temos um coração principal
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha 4 corações para formar os pares");
        return;
      }

      // Lógica para pares com o coração principal
      const mainNumber = getNumberForHeart(mainHeart);
      const selectedPairs = selectedHearts
        .filter(h => h !== mainHeart) // Exclui o coração principal da lista
        .map(pairColor => ({
          main: mainNumber,
          pair: getNumberForHeart(pairColor)
        }));
      
      console.log("🎭 Current pairs:", selectedPairs);

      // Verifica se já formou todos os pares necessários
      if (selectedPairs.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os pares necessários");
        return;
      }

      const newPairNumber = getNumberForHeart(color);
      
      // Conta quantas vezes cada número já foi usado em pares
      const numberUsageCount = selectedPairs.reduce((acc, pair) => {
        acc[pair.pair] = (acc[pair.pair] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      console.log("📊 Number usage count:", numberUsageCount);

      // Para pares do mesmo número (ex: 22-22), permite apenas uma vez
      if (mainNumber === newPairNumber) {
        const sameNumberPairCount = selectedPairs.filter(
          pair => pair.pair === newPairNumber
        ).length;

        if (sameNumberPairCount >= 1) {
          console.log("❌ Same number pair already exists");
          playSounds.error();
          toast.error("Você já formou um par com este mesmo número");
          return;
        }
      } 
      // Para números diferentes, permite até duas vezes
      else if (numberUsageCount[newPairNumber] >= 2) {
        console.log("❌ Number already used twice:", newPairNumber);
        playSounds.error();
        toast.error("Este número já foi usado duas vezes em pares");
        return;
      }

      console.log("✅ Adding new pair:", {
        main: mainNumber,
        pair: newPairNumber
      });
      
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