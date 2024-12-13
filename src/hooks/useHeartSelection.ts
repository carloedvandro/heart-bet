import { useDozenSelection } from "./heart-selection/useDozenSelection";
import { useHundredSelection } from "./heart-selection/useHundredSelection";
import { useThousandSelection } from "./heart-selection/useThousandSelection";
import { BetType } from "@/types/betting";

export const useHeartSelection = (
  betType: BetType,
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const handleDozenSelection = useDozenSelection(selectedHearts, setSelectedHearts);
  const handleHundredSelection = useHundredSelection(selectedHearts, setSelectedHearts);
  const handleThousandSelection = useThousandSelection(selectedHearts, setSelectedHearts);

  const handleHeartClick = (color: string) => {
    console.log("Heart clicked:", {
      color,
      betType,
      currentSelected: selectedHearts,
    });

    if (betType === "dozen") {
      return handleDozenSelection(color);
    }

    if (betType === "hundred") {
      return handleHundredSelection(color);
    }

    if (betType === "thousand") {
      return handleThousandSelection(color);
    }

    return true;
  };

  return { handleHeartClick };
};