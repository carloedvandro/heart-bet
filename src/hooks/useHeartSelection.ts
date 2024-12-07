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
      selectedHeartCount: selectedHearts.length,
    });

    if (betType === "simple_group") {
      // Define o coração principal se ainda não foi definido
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]); // Define apenas o principal
        toast.info("Agora escolha 4 corações para formar os pares");
        return;
      }

      // Caso o mesmo coração principal seja clicado novamente (par reflexivo)
      if (color === mainHeart) {
        const mainHeartCount = selectedHearts.filter(
          (heart) => heart === mainHeart
        ).length;

        // Permitir apenas 1 par reflexivo
        if (mainHeartCount >= 2) {
          console.log("❌ Reflexive pair already exists");
          playSounds.error();
          toast.error("Você já formou o par reflexivo com este coração");
          return;
        }

        // Adicionar o par reflexivo
        console.log("✅ Adding reflexive pair:", color);
        setSelectedHearts((prev) => [...prev, color]);
        return;
      }

      // Verifica se já atingiu o limite de 4 pares
      const pairs = selectedHearts.filter((heart) => heart !== mainHeart);
      if (pairs.length >= 4) {
        console.log("❌ Maximum selections reached");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Verifica se o par já existe (apenas para não reflexivos)
      const existingPair = pairs.includes(color);
      if (existingPair) {
        console.log("❌ Pair already exists:", color);
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Adiciona o novo coração à lista de pares
      console.log("✅ Adding new pair:", color);
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