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
      // Primeira seleção - definindo o coração principal
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha os corações para formar os pares");
        return;
      }

      // Obtém apenas os pares formados (excluindo o coração principal)
      const pairs = selectedHearts.slice(1);
      console.log("Current pairs:", pairs);

      // Verifica se atingiu o máximo de pares (4 pares)
      if (pairs.length >= 4) {
        console.log("❌ Máximo de pares atingido");
        playSounds.error();
        toast.error("Você já selecionou todos os corações necessários");
        return;
      }

      // Verifica se o coração já foi usado em algum par
      if (pairs.includes(color)) {
        console.log("❌ Coração já usado em um par");
        playSounds.error();
        toast.error("Este coração já foi usado em um par");
        return;
      }

      // Adiciona um novo par
      console.log("✅ Adicionando novo par:", color);
      const newPairs = [...pairs, color];
      setSelectedHearts([mainHeart, ...newPairs]);
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