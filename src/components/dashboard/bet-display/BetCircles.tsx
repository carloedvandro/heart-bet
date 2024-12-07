import { Heart } from "lucide-react";
import { getHeartForNumber } from "@/utils/heartNumberMapping";

const SplitCircle = ({ firstColor, secondColor }: { firstColor: string, secondColor: string }) => (
  <div className="relative w-4 h-4 rounded-full overflow-hidden border border-gray-300 inline-block mr-1">
    <div className="absolute top-0 left-0 w-full h-full">
      <div 
        className="absolute top-0 left-0 w-1/2 h-full" 
        style={{ backgroundColor: `var(--heart-${firstColor})` }}
      />
      <div 
        className="absolute top-0 right-0 w-1/2 h-full" 
        style={{ backgroundColor: `var(--heart-${secondColor})` }}
      />
    </div>
  </div>
);

const SingleCircle = ({ color }: { color: string }) => (
  <div 
    className="w-4 h-4 rounded-full border border-gray-300 inline-block mr-1"
    style={{ backgroundColor: `var(--heart-${color})` }}
  />
);

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers?: number[] | null;
}

export const BetCircles = ({ hearts, betType, isAdmin, numbers }: BetCirclesProps) => {
  if (isAdmin) {
    return <span>{numbers?.join(", ") || "N/A"}</span>;
  }

  if (!hearts?.length && !numbers?.length) return <span>N/A</span>;

  if (betType === "simple_group") {
    if (!numbers?.length) return <span>N/A</span>;
    
    // Para cada número de dois dígitos, extrair os dígitos individuais
    const pairs = numbers.map(num => {
      const firstDigit = Math.floor(num / 10);
      const secondDigit = num % 10;
      return {
        firstColor: getHeartForNumber(firstDigit),
        secondColor: getHeartForNumber(secondDigit)
      };
    });

    return (
      <>
        {pairs.map((pair, index) => (
          <SplitCircle 
            key={`${pair.firstColor}-${pair.secondColor}-${index}`}
            firstColor={pair.firstColor}
            secondColor={pair.secondColor}
          />
        ))}
      </>
    );
  }

  // Para outros tipos de apostas, mostrar círculos individuais
  if (numbers?.length) {
    return (
      <>
        {numbers.map((num, index) => (
          <SingleCircle 
            key={`${num}-${index}`} 
            color={getHeartForNumber(num)}
          />
        ))}
      </>
    );
  }

  // Fallback para mostrar as cores originais se disponíveis
  return (
    <>
      {hearts?.map((color, index) => (
        <SingleCircle key={`${color}-${index}`} color={color} />
      ))}
    </>
  );
};