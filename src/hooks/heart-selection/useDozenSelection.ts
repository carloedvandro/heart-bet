import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { useTemporaryBetState } from "../useTemporaryBetState";

export const useDozenSelection = (
  selectedHearts: string[],
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const setCombinations = useTemporaryBetState((state) => state.setCombinations);

  const handleDozenSelection = (color: string) => {
    if (selectedHearts.length >= 2) {
      toast.error("Máximo de 2 corações para dezena");
      return false;
    }

    const newSelectedHearts = [...selectedHearts, color];
    setSelectedHearts(newSelectedHearts);
    playSounds.click();

    if (newSelectedHearts.length === 2) {
      const firstNumber = getNumberForHeart(newSelectedHearts[0]);
      const secondNumber = getNumberForHeart(newSelectedHearts[1]);
      
      let twoDigitNumber;
      if (firstNumber === 0 && secondNumber === 0) {
        twoDigitNumber = 0;
      } else {
        twoDigitNumber = firstNumber * 10 + secondNumber;
      }
      
      setCombinations([twoDigitNumber]);
      const formattedNumber = twoDigitNumber === 0 ? "00" : twoDigitNumber.toString().padStart(2, '0');
      toast.success(`Dezena formada: ${formattedNumber}`);
    }
    return true;
  };

  return handleDozenSelection;
};