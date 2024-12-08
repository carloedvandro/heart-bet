import { toast } from "sonner";
import { BetType } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";
import { useTemporaryBetState } from "./useTemporaryBetState";

export const useHeartSelection = (
  betType: BetType,
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const { setCombinations } = useTemporaryBetState();

  const handleHeartClick = (color: string) => {
    console.log("🎯 Heart clicked:", color);

    // Lógica para grupo simples
    if (betType === "simple_group") {
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        playSounds.click();
        return;
      }

      if (selectedHearts.length === 1) {
        const firstNumber = getNumberForHeart(mainHeart);
        const secondNumber = getNumberForHeart(color);
        const twoDigitNumber = firstNumber * 10 + secondNumber;
        
        console.log("🎲 First number:", firstNumber);
        console.log("🎲 Second number:", secondNumber);
        console.log("🎲 Formed number:", twoDigitNumber);
        
        const groupNumbers = getGroupNumbers(twoDigitNumber);
        console.log("🎯 Group numbers:", groupNumbers);
        
        setSelectedHearts([mainHeart, color]);
        setCombinations(groupNumbers);
        playSounds.click();
        toast.success(`Grupo formado: ${groupNumbers.map(n => n.toString().padStart(2, '0')).join(", ")}`);
        return;
      }
    }

    // Lógica para dezena
    if (betType === "dozen") {
      if (selectedHearts.length >= 2) {
        toast.error("Máximo de 2 corações para dezena");
        return;
      }

      const newSelectedHearts = [...selectedHearts, color];
      setSelectedHearts(newSelectedHearts);
      playSounds.click();

      if (newSelectedHearts.length === 2) {
        const firstNumber = getNumberForHeart(newSelectedHearts[0]);
        const secondNumber = getNumberForHeart(newSelectedHearts[1]);
        // Garantir que o número seja tratado como uma dezena de dois dígitos
        const twoDigitNumber = Number(`${firstNumber}${secondNumber}`);
        setCombinations([twoDigitNumber]);
        // Formatar o número com dois dígitos para exibição
        const formattedNumber = twoDigitNumber.toString().padStart(2, '0');
        toast.success(`Dezena formada: ${formattedNumber}`);
      }
      return;
    }

    // Lógica para outros tipos de aposta
    if (selectedHearts.includes(color)) {
      setSelectedHearts(selectedHearts.filter(h => h !== color));
      playSounds.click();
      return;
    }

    if (selectedHearts.length >= 4) {
      toast.error("Máximo de 4 corações");
      return;
    }

    setSelectedHearts([...selectedHearts, color]);
    playSounds.click();
  };

  return { handleHeartClick };
};