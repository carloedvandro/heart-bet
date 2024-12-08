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
    if (betType === 'simple_group' && hearts.length === 2) {
      const [heart1, heart2] = hearts;
      const num1 = Number(Object.entries(getHeartForNumber).find(([_, color]) => color === heart1)?.[0]);
      const num2 = Number(Object.entries(getHeartForNumber).find(([_, color]) => color === heart2)?.[0]);
      
      // Formar o número do grupo (menor primeiro)
      const groupNumber = num1 < num2 ? num1 * 10 + num2 : num2 * 10 + num1;
      const groupNumbers = getGroupNumbers(groupNumber);
      
      console.log("Group formed:", groupNumbers);
      return <span>{groupNumbers.join(", ")}</span>;
    }
    
    // Para outros tipos de apostas, mostrar os números individuais
    const heartNumbers = hearts.map(heart => {
      const number = Object.entries(getHeartForNumber).find(([_, color]) => color === heart)?.[0];
      return number || "N/A";
    });
    
    console.log("Individual numbers:", heartNumbers);
    return <span>{heartNumbers.join(", ")}</span>;
  }

  console.log("No valid data found, returning N/A");
  return <span>N/A</span>;
};