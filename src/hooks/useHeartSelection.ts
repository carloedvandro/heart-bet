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
    console.log("🎯 Heart clicked:", color);
    console.log("📍 Current state:", {
      betType,
      mainHeart,
      selectedHearts,
      totalHearts: selectedHearts.length
    });

    if (betType === "simple_group") {
      // Initial main heart selection
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]); // Only store the main heart
        toast.info("Agora escolha 4 corações para formar os pares");
        return;
      }

      // Get current pairs (excluding main heart)
      const currentPairs = selectedHearts.slice(1); // Ignore first element (main heart)
      console.log("📊 Current pairs:", currentPairs);

      // Handle reflexive pair (clicking main heart again)
      if (color === mainHeart) {
        // Check if we already have a reflexive pair by counting occurrences
        const mainHeartOccurrences = selectedHearts.filter(h => h === mainHeart).length;
        
        if (mainHeartOccurrences > 1) {
          console.log("❌ Reflexive pair already exists");
          playSounds.error();
          toast.error("Você já formou o par reflexivo com este coração");
          return;
        }

        console.log("✅ Adding reflexive pair:", color);
        setSelectedHearts(prev => [...prev, color]);
        return;
      }

      // Check if maximum pairs reached (4 pairs)
      if (currentPairs.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Check for duplicate pair
      if (currentPairs.includes(color)) {
        console.log("❌ Pair already exists:", color);
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Add new pair
      console.log("✅ Adding new pair:", color);
      setSelectedHearts(prev => [...prev, color]);
    } else {
      // Logic for other bet types
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