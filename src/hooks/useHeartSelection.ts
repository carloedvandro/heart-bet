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
    console.log("Current state:", { betType, mainHeart, selectedHearts });

    if (betType === "simple_group") {
      // Seleção inicial do coração principal
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha 4 corações para formar os pares");
        return;
      }

      // Obtém os pares já formados (excluindo o coração principal)
      const currentPairs = selectedHearts.slice(1);

      // Trata o par reflexivo (clicando no coração principal novamente)
      if (color === mainHeart) {
        if (currentPairs.includes(mainHeart)) {
          console.log("❌ Par reflexivo já existe");
          playSounds.error();
          toast.error("Você já formou o par reflexivo com este coração");
          return;
        }

        console.log("✅ Adicionando par reflexivo");
        setSelectedHearts(prev => [...prev, color]);
        return;
      }

      // Verifica se atingiu o máximo de pares (4 pares)
      if (currentPairs.length >= 4) {
        console.log("❌ Máximo de pares atingido");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Verifica se o par já existe
      if (currentPairs.includes(color)) {
        console.log("❌ Par já existe");
        playSounds.error();
        toast.error("Este par já foi formado");
        return;
      }

      // Adiciona novo par
      console.log("✅ Adicionando novo par:", color);
      setSelectedHearts(prev => [...prev, color]);
    } else {
      // Lógica para outros tipos de aposta
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