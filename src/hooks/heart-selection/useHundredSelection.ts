import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { useTemporaryBetState } from "../useTemporaryBetState";

export const useHundredSelection = (
  selectedHearts: string[],
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const setCombinations = useTemporaryBetState((state) => state.setCombinations);

  const handleHundredSelection = (color: string) => {
    if (selectedHearts.length >= 3) {
      toast.error("Máximo de 3 corações para centena");
      return false;
    }

    const newSelectedHearts = [...selectedHearts, color];
    setSelectedHearts(newSelectedHearts);
    playSounds.click();

    if (newSelectedHearts.length === 3) {
      const firstNumber = getNumberForHeart(newSelectedHearts[0]);
      const secondNumber = getNumberForHeart(newSelectedHearts[1]);
      const thirdNumber = getNumberForHeart(newSelectedHearts[2]);
      
      let threeDigitNumber;
      if (firstNumber === 0 && secondNumber === 0 && thirdNumber === 0) {
        threeDigitNumber = 0;
      } else {
        threeDigitNumber = firstNumber * 100 + secondNumber * 10 + thirdNumber;
      }
      
      setCombinations([threeDigitNumber]);
      const formattedNumber = threeDigitNumber.toString().padStart(3, '0');
      toast.success(`Centena formada: ${formattedNumber}`);
    }
    return true;
  };

  return handleHundredSelection;
};