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

      // Caso o mesmo coração seja clicado novamente (par reflexivo)
      if (color === mainHeart) {
        // Verifica se já existe um par reflexivo
        const reflexivePairExists = selectedHearts.filter(heart => heart === mainHeart).length >= 2;
        
        if (reflexivePairExists) {
          console.log("❌ Reflexive pair already exists");
          playSounds.error();
          toast.error("Você já formou o par reflexivo com este coração");
          return;
        }
      }

      // Verifica se já atingiu o limite total de seleções (1 principal + 4 pares = 5)
      if (selectedHearts.length >= 5) {
        console.log("❌ Maximum selections reached");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Verifica se este par já existe (exceto para pares reflexivos)
      const existingPair = selectedHearts.includes(color) && color !== mainHeart;
      if (existingPair) {
        console.log("❌ Pair already exists:", color);
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      console.log("✅ Adding heart to selection:", color);
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