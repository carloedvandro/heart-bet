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

  // Para grupo simples, mostrar todos os números como círculos divididos
  if (betType === "simple_group") {
    if (!numbers?.length) return <span>N/A</span>;
    
    // Para cada número de dois dígitos, extrair os dígitos individuais e criar círculos divididos
    return (
      <div className="flex flex-wrap gap-1">
        {numbers.map((num, index) => {
          const firstDigit = Math.floor(num / 10);
          const secondDigit = num % 10;
          return (
            <SplitCircle 
              key={`${num}-${index}`}
              firstColor={getHeartForNumber(firstDigit)}
              secondColor={getHeartForNumber(secondDigit)}
            />
          );
        })}
      </div>
    );
  }

  // Para outros tipos de apostas, mostrar círculos individuais para cada número
  if (numbers?.length) {
    return (
      <div className="flex flex-wrap gap-1">
        {numbers.map((num, index) => (
          <SingleCircle 
            key={`${num}-${index}`} 
            color={getHeartForNumber(num)}
          />
        ))}
      </div>
    );
  }

  // Fallback para mostrar as cores originais se disponíveis
  return (
    <div className="flex flex-wrap gap-1">
      {hearts?.map((color, index) => (
        <SingleCircle key={`${color}-${index}`} color={color} />
      ))}
    </div>
  );
};