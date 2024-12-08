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
  const setCombinations = useTemporaryBetState((state) => state.setCombinations);

  const handleHeartClick = (color: string) => {
    console.log("🎯 Heart clicked:", color);

    // Lógica para grupo simples
    if (betType === "simple_group") {
      // Se não há coração principal selecionado
      if (!mainHeart) {
        console.log("🎈 Setting main heart:", color);
        setMainHeart(color);
        setSelectedHearts([color]);
        playSounds.click();
        toast.info("Agora escolha outro coração para formar o grupo. Você pode escolher o mesmo coração novamente!");
        return;
      }

      // Se já tem coração principal e está selecionando o segundo coração
      if (selectedHearts.length === 1) {
        const firstNumber = getNumberForHeart(mainHeart);
        const secondNumber = getNumberForHeart(color);
        
        // Formatar o número de dois dígitos, tratando especialmente o caso do zero
        let twoDigitNumber;
        if (firstNumber === 0 && secondNumber === 0) {
          twoDigitNumber = 0; // Caso especial para 00
        } else {
          twoDigitNumber = firstNumber * 10 + secondNumber;
        }
        
        console.log("🎲 First number:", firstNumber);
        console.log("🎲 Second number:", secondNumber);
        console.log("🎲 Formed number:", twoDigitNumber);
        
        const groupNumbers = getGroupNumbers(twoDigitNumber);
        console.log("🎯 Group numbers:", groupNumbers);
        
        setSelectedHearts([mainHeart, color]);
        setCombinations(groupNumbers);
        playSounds.click();

        // Formatação correta para exibição no toast, garantindo que 00 seja mostrado corretamente
        const formattedNumber = firstNumber === 0 && secondNumber === 0 
          ? "00"
          : twoDigitNumber.toString().padStart(2, '0');

        toast.success(`Grupo formado: ${groupNumbers.map(n => n.toString().padStart(2, '0')).join(", ")}`);
        return;
      }

      // Se tentar selecionar mais de 2 corações no grupo simples
      if (selectedHearts.length >= 2) {
        toast.error("Máximo de 2 corações para grupo simples");
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
        const twoDigitNumber = Number(`${firstNumber}${secondNumber}`);
        setCombinations([twoDigitNumber]);
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