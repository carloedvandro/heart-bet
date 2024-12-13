import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { useTemporaryBetState } from "../useTemporaryBetState";

export const useSimpleGroupSelection = (
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const setCombinations = useTemporaryBetState((state) => state.setCombinations);

  const handleSimpleGroupSelection = (color: string) => {
    if (!mainHeart) {
      console.log("🎈 Setting main heart:", color);
      setMainHeart(color);
      setSelectedHearts([color]);
      playSounds.click();
      toast.info("Agora escolha outro coração para formar a dezena. Você pode escolher o mesmo coração novamente!");
      return true;
    }

    if (selectedHearts.length === 1) {
      const firstNumber = getNumberForHeart(mainHeart);
      const secondNumber = getNumberForHeart(color);
      
      let twoDigitNumber;
      if (firstNumber === 0 && secondNumber === 0) {
        twoDigitNumber = 0;
      } else {
        twoDigitNumber = firstNumber * 10 + secondNumber;
      }
      
      setSelectedHearts([mainHeart, color]);
      setCombinations([twoDigitNumber]);
      playSounds.click();

      const formattedNumber = firstNumber === 0 && secondNumber === 0 
        ? "00"
        : twoDigitNumber.toString().padStart(2, '0');

      toast.success(`Dezena formada: ${formattedNumber}`);
      return true;
    }

    if (selectedHearts.length >= 2) {
      toast.error("Máximo de 2 corações para dezena simples");
      return false;
    }

    return true;
  };

  return handleSimpleGroupSelection;
};