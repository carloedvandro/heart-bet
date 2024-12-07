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

      // Se já temos o coração principal
      const mainNumber = getNumberForHeart(mainHeart);
      console.log("🎲 Main heart number:", mainNumber);

      // Se já selecionou todos os pares necessários
      const selectedPairs = selectedHearts.filter(c => c !== mainHeart);
      console.log("🎭 Current selected pairs:", selectedPairs);
      
      if (selectedPairs.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os pares necessários");
        return;
      }

      // Verifica se o par já existe (incluindo pares iguais)
      const existingPairs = selectedPairs.map(pairColor => {
        const pairNumber = getNumberForHeart(pairColor);
        // Para pares iguais, retorna o número duplicado (ex: "55")
        if (mainNumber === pairNumber) {
          return `${mainNumber}${mainNumber}`;
        }
        // Para pares diferentes, mantém a ordem crescente
        return mainNumber < pairNumber 
          ? `${mainNumber}${pairNumber}` 
          : `${pairNumber}${mainNumber}`;
      });
      
      console.log("🔍 Existing pairs:", existingPairs);

      // Verifica o novo par que seria formado
      const newPairNumber = getNumberForHeart(color);
      // Para pares iguais
      const newPair = mainNumber === newPairNumber
        ? `${mainNumber}${mainNumber}`
        : mainNumber < newPairNumber 
          ? `${mainNumber}${newPairNumber}` 
          : `${newPairNumber}${mainNumber}`;
      
      console.log("🆕 Attempting to form new pair:", newPair);

      if (existingPairs.includes(newPair)) {
        console.log("❌ Pair already exists");
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      console.log("✅ Adding new heart to selection:", color);
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