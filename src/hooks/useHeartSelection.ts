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

    // Se não há coração principal selecionado, define este como principal
    if (!mainHeart) {
      console.log("🎈 Setting main heart:", color);
      setMainHeart(color);
      setSelectedHearts([color]);
      toast.info("Agora escolha os corações para formar os pares");
      return;
    }

    // Se já temos 5 corações (1 principal + 4 pares) e este não é um dos selecionados
    if (selectedHearts.length >= 5 && !selectedHearts.includes(color)) {
      playSounds.error();
      toast.error("Você já selecionou todos os corações necessários");
      return;
    }

    // Se o coração já está selecionado, remove-o (exceto se for o principal)
    if (selectedHearts.includes(color) && color !== mainHeart) {
      setSelectedHearts(prev => prev.filter(h => h !== color));
      return;
    }

    // Adiciona o coração como um novo par
    if (color !== mainHeart) {
      setSelectedHearts(prev => [...prev, color]);
    }
  };

  return { handleHeartClick };
};