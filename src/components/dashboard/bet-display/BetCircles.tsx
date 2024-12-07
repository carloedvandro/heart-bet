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
  if (isAdmin && numbers?.length) {
    return <span>{numbers.join(", ")}</span>;
  }

  if (!hearts?.length && !numbers?.length) return <span>N/A</span>;

  // Para grupo simples, processar os números gerados
  if (betType === "simple_group" && numbers?.length) {
    return (
      <div className="flex flex-wrap gap-1">
        {numbers.map((num, index) => {
          // Extrair os dois dígitos do número
          const firstDigit = Math.floor(num / 10);
          const secondDigit = num % 10;
          
          // Obter as cores correspondentes aos números
          const firstColor = getHeartForNumber(firstDigit);
          const secondColor = getHeartForNumber(secondDigit);
          
          return (
            <SplitCircle 
              key={`${num}-${index}`}
              firstColor={firstColor}
              secondColor={secondColor}
            />
          );
        })}
      </div>
    );
  }

  // Para outros tipos de apostas ou quando não temos números
  return (
    <div className="flex flex-wrap gap-1">
      {hearts?.map((color, index) => (
        <SingleCircle key={`${color}-${index}`} color={color} />
      ))}
    </div>
  );
};