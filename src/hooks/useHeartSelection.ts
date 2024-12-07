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

      // Verifica se já formou todos os pares necessários
      if (selectedHearts.length >= 4) {
        console.log("❌ Maximum pairs reached");
        playSounds.error();
        toast.error("Você já selecionou todos os pares necessários");
        return;
      }

      // Conta quantas vezes este coração já foi selecionado
      const colorCount = selectedHearts.filter(h => h === color).length;

      // Se já selecionou este coração duas vezes, bloqueia
      if (colorCount >= 2) {
        console.log("❌ Heart already selected twice:", color);
        playSounds.error();
        toast.error("Você já selecionou este coração duas vezes");
        return;
      }

      console.log("✅ Adding heart:", color);
      setSelectedHearts(prev => [...prev, color]);
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