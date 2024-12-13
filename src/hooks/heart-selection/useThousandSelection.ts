import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { useTemporaryBetState } from "../useTemporaryBetState";

export const useThousandSelection = (
  selectedHearts: string[],
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const setCombinations = useTemporaryBetState((state) => state.setCombinations);

  const handleThousandSelection = (color: string) => {
    if (selectedHearts.length >= 4) {
      toast.error("Máximo de 4 corações para milhar");
      return false;
    }

    const newSelectedHearts = [...selectedHearts, color];
    setSelectedHearts(newSelectedHearts);
    playSounds.click();

    if (newSelectedHearts.length === 4) {
      const firstNumber = getNumberForHeart(newSelectedHearts[0]);
      const secondNumber = getNumberForHeart(newSelectedHearts[1]);
      const thirdNumber = getNumberForHeart(newSelectedHearts[2]);
      const fourthNumber = getNumberForHeart(newSelectedHearts[3]);
      
      let fourDigitNumber;
      if (firstNumber === 0 && secondNumber === 0 && thirdNumber === 0 && fourthNumber === 0) {
        fourDigitNumber = 0;
      } else {
        fourDigitNumber = firstNumber * 1000 + secondNumber * 100 + thirdNumber * 10 + fourthNumber;
      }
      
      setCombinations([fourDigitNumber]);
      const formattedNumber = fourDigitNumber.toString().padStart(4, '0');
      toast.success(`Milhar formada: ${formattedNumber}`);
    }
    return true;
  };

  return handleThousandSelection;
};