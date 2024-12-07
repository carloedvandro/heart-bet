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
    if (selectedHearts.length === 1 && color !== mainHeart) {
      const mainNumber = getNumberForHeart(mainHeart);
      const secondNumber = getNumberForHeart(color);
      
      // Formar o número com dois dígitos, garantindo que o menor número venha primeiro
      const twoDigitNumber = mainNumber < secondNumber 
        ? mainNumber * 10 + secondNumber 
        : secondNumber * 10 + mainNumber;
      
      console.log("🎲 Formed number:", twoDigitNumber);
      
      // Obter os números do grupo
      const groupNumbers = getGroupNumbers(twoDigitNumber);
      console.log("🎯 Group numbers:", groupNumbers);
      
      // Converter os números do grupo de volta para corações
      const heartColors = groupNumbers.map(num => {
        // Aqui você precisaria implementar uma função que converte número de volta para cor
        // Por enquanto, vamos manter os dois primeiros corações selecionados
        return num === mainNumber ? mainHeart : num === secondNumber ? color : null;
      });
      
      // Atualizar a seleção com todos os corações do grupo
      setSelectedHearts([mainHeart, color]);
      toast.success(`Grupo formado: ${groupNumbers.join(", ")}`);
      return;
    }

    // Se o coração já está selecionado, remove-o (exceto se for o principal)
    if (selectedHearts.includes(color) && color !== mainHeart) {
      setSelectedHearts(prev => prev.filter(h => h !== color));
      return;
    }
  };

  return { handleHeartClick };
};