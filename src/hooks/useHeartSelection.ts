import { BetType } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { useSimpleGroupSelection } from "./heart-selection/useSimpleGroupSelection";
import { useDozenSelection } from "./heart-selection/useDozenSelection";
import { toast } from "sonner";

export const useHeartSelection = (
  betType: BetType,
  mainHeart: string | null,
  selectedHearts: string[],
  setMainHeart: (heart: string | null) => void,
  setSelectedHearts: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const handleSimpleGroupSelection = useSimpleGroupSelection(
    mainHeart,
    selectedHearts,
    setMainHeart,
    setSelectedHearts
  );

  const handleDozenSelection = useDozenSelection(
    selectedHearts,
    setSelectedHearts
  );

  const handleHeartClick = (color: string) => {
    console.log("🎯 Heart clicked:", color);
    console.log("Current state:", { betType, mainHeart, selectedHearts });

    // Se o coração já está selecionado, não fazer nada
    if (selectedHearts.includes(color) && betType !== "simple_group") {
      return false;
    }

    if (betType === "simple_group") {
      return handleSimpleGroupSelection(color);
    }

    if (betType === "dozen") {
      return handleDozenSelection(color);
    }

    // Para aposta do tipo centena (hundred), permitir exatamente 3 seleções
    if (betType === "hundred") {
      if (selectedHearts.length >= 3 && !selectedHearts.includes(color)) {
        toast.error("Máximo de 3 corações para centena");
        return false;
      }
      
      if (!selectedHearts.includes(color)) {
        setSelectedHearts([...selectedHearts, color]);
        playSounds.click();
      }
      return true;
    }

    // Para aposta do tipo milhar (thousand), permitir exatamente 4 seleções
    if (betType === "thousand") {
      if (selectedHearts.length >= 4 && !selectedHearts.includes(color)) {
        toast.error("Máximo de 4 corações para milhar");
        return false;
      }
      
      if (!selectedHearts.includes(color)) {
        setSelectedHearts([...selectedHearts, color]);
        playSounds.click();
      }
      return true;
    }

    // Lógica para outros tipos de aposta
    if (selectedHearts.includes(color)) {
      setSelectedHearts(selectedHearts.filter(h => h !== color));
      playSounds.click();
      return true;
    }

    if (selectedHearts.length >= 4) {
      toast.error("Máximo de 4 corações");
      return false;
    }

    setSelectedHearts([...selectedHearts, color]);
    playSounds.click();
    return true;
  };

  return { handleHeartClick };
};