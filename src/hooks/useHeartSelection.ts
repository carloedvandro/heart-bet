import { toast } from "sonner";
import { BetType } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";

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
      toast.info("Agora escolha o segundo coração para formar o par");
      return;
    }

    // Se já temos o coração principal e este é o segundo coração
    if (selectedHearts.length === 1) {
      const mainNumber = getNumberForHeart(mainHeart);
      const secondNumber = getNumberForHeart(color);
      
      // Formar o número com dois dígitos na ordem exata de seleção
      const twoDigitNumber = mainNumber * 10 + secondNumber;
      
      console.log("🎲 Formed number:", twoDigitNumber);
      
      // Obter os números do grupo
      const groupNumbers = getGroupNumbers(twoDigitNumber);
      console.log("🎯 Group numbers:", groupNumbers);
      
      // Atualizar a seleção com os dois corações na ordem de seleção
      setSelectedHearts([mainHeart, color]);
      toast.success(`Grupo formado: ${groupNumbers.join(", ")}`);
      return;
    }
  };

  return { handleHeartClick };
};