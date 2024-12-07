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
      selectedHeartCount: selectedHearts.length,
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

      const mainNumber = getNumberForHeart(mainHeart);

      // Lista de pares já formados
      const selectedPairs = selectedHearts.map((pairColor) => ({
        main: mainNumber,
        pair: getNumberForHeart(pairColor),
      }));

      console.log("🎭 Existing pairs:", selectedPairs);

      // Verifica se já formou todos os pares necessários
      if (selectedPairs.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os pares necessários");
        return;
      }

      const newPairNumber = getNumberForHeart(color);
      const newPair = { main: mainNumber, pair: newPairNumber };

      // Evitar pares duplicados (ex: 22-33 e 33-22 são iguais)
      const isDuplicatePair = selectedPairs.some(
        (pair) =>
          (pair.main === newPair.main && pair.pair === newPair.pair) ||
          (pair.main === newPair.pair && pair.pair === newPair.main)
      );

      if (isDuplicatePair) {
        console.log("❌ Duplicate pair detected");
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Permitir apenas uma vez pares com o mesmo número (ex: 22-22)
      if (mainNumber === newPairNumber) {
        const sameNumberPairCount = selectedPairs.filter(
          (pair) => pair.main === mainNumber && pair.pair === mainNumber
        ).length;

        if (sameNumberPairCount >= 1) {
          console.log("❌ Same number pair already exists");
          playSounds.error();
          toast.error("Você já formou um par com este mesmo número");
          return;
        }
      }

      console.log("✅ Adding new pair:", newPair);
      setSelectedHearts((prev) => [...prev, color]);
    } else {
      // Lógica para outros tipos de apostas
      setSelectedHearts((prev) => {
        if (prev.includes(color)) {
          return prev.filter((c) => c !== color);
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