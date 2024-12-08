import { getHeartForNumber } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers?: number[] | null;
}

export const BetCircles = ({ hearts, betType, isAdmin, numbers }: BetCirclesProps) => {
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    hearts,
    betType,
    isAdmin,
    numbers
  });

  // Se já temos os números, mostra eles diretamente
  if (numbers?.length) {
    console.log("Showing direct numbers:", numbers);
    return <span>{numbers.join(", ")}</span>;
  }

  // Se temos corações, vamos converter para números
  if (hearts?.length) {
    console.log("Converting hearts to numbers");
    
    // Se for grupo simples
    if (betType === 'simple_group') {
      // Converter corações para números
      const heartNumbers = hearts.map(heart => {
        const number = Number(Object.entries(getHeartForNumber).find(([_, color]) => color === heart)?.[0]);
        return isNaN(number) ? 0 : number;
      });

      console.log("Heart numbers before processing:", heartNumbers);

      // Se tivermos números válidos
      if (heartNumbers.some(num => num !== 0)) {
        // Para corações repetidos, usar o mesmo número
        if (heartNumbers[0] === heartNumbers[1]) {
          const groupNumbers = getGroupNumbers(heartNumbers[0]);
          console.log("Group numbers for repeated heart:", groupNumbers);
          return <span>{groupNumbers.join(", ")}</span>;
        }

        // Para corações diferentes, formar o grupo
        const [num1, num2] = heartNumbers.sort((a, b) => a - b);
        const groupNumber = num1 * 10 + num2;
        const groupNumbers = getGroupNumbers(groupNumber);
        
        console.log("Group numbers for different hearts:", groupNumbers);
        return <span>{groupNumbers.join(", ")}</span>;
      }
    }
    
    // Para outros tipos de apostas, mostrar os números individuais
    const heartNumbers = hearts.map(heart => {
      const number = Object.entries(getHeartForNumber).find(([_, color]) => color === heart)?.[0];
      return number || "0";
    });
    
    console.log("Individual numbers:", heartNumbers);
    return <span>{heartNumbers.join(", ")}</span>;
  }

  console.log("No valid data found, returning N/A");
  return <span>N/A</span>;
};