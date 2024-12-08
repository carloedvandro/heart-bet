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
    
    // Se for grupo simples e tivermos dois corações
    if (betType === 'simple_group') {
      const heartNumbers = hearts.map(heart => {
        return Number(Object.entries(getHeartForNumber).find(([_, color]) => color === heart)?.[0]) || 0;
      }).filter(num => num !== 0);

      if (heartNumbers.length === 2) {
        // Formar o número do grupo (menor primeiro)
        const [num1, num2] = heartNumbers.sort((a, b) => a - b);
        const groupNumber = num1 * 10 + num2;
        const groupNumbers = getGroupNumbers(groupNumber);
        
        console.log("Group formed:", groupNumbers);
        return <span>{groupNumbers.join(", ")}</span>;
      }
      
      console.log("Simple group numbers:", heartNumbers);
      return <span>{heartNumbers.join(", ")}</span>;
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