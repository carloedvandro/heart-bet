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
      
      const twoDigitNumber = firstNumber < secondNumber 
        ? firstNumber * 10 + secondNumber
        : secondNumber * 10 + firstNumber;
      
      console.log("🎲 Formed number:", twoDigitNumber);
      
      const groupNumbers = getGroupNumbers(twoDigitNumber);
      console.log("🎯 Group numbers:", groupNumbers);
      
      setSelectedHearts([mainHeart, color]);
      setCombinations(groupNumbers);
      playSounds.click();
      toast.success(`Grupo formado: ${groupNumbers.map(n => n.toString().padStart(2, '0')).join(", ")}`);
      return;
    }
  };

  return { handleHeartClick };
};