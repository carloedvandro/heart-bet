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

      // Get non-main heart pairs
      const nonMainPairs = selectedHearts.filter(heart => heart !== mainHeart);

      // Handle reflexive pair (clicking main heart again)
      if (color === mainHeart) {
        const mainHeartOccurrences = selectedHearts.filter(heart => heart === mainHeart).length;
        
        if (mainHeartOccurrences >= 2) {
          console.log("❌ Reflexive pair already exists");
          playSounds.error();
          toast.error("Você já formou o par reflexivo com este coração");
          return;
        }

        console.log("✅ Adding reflexive pair:", color);
        setSelectedHearts(prev => [...prev, color]);
        return;
      }

      // Check if maximum pairs reached (4 non-main pairs)
      if (nonMainPairs.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Check for duplicate non-reflexive pair
      if (nonMainPairs.includes(color)) {
        console.log("❌ Pair already exists:", color);
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Add new non-reflexive pair
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