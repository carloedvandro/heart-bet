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
      // Se não há coração principal selecionado
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha os corações para formar os pares");
        return;
      }

      // Obtém apenas os pares formados (excluindo o coração principal)
      const currentPairs = selectedHearts.slice(1);
      console.log("Current pairs:", currentPairs);

      // Verifica se atingiu o máximo de pares (4 pares)
      if (currentPairs.length >= 4) {
        console.log("❌ Máximo de pares atingido");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Se o coração clicado já está em um par, remove ele
      if (currentPairs.includes(color)) {
        console.log("🗑️ Removendo par:", color);
        setSelectedHearts([
          mainHeart,
          ...currentPairs.filter(heart => heart !== color)
        ]);
        return;
      }

      // Adiciona um novo par
      console.log("✅ Adicionando novo par:", color);
      setSelectedHearts([mainHeart, ...currentPairs, color]);
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