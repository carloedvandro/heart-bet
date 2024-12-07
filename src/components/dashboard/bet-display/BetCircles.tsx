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

  // Se não houver hearts nem numbers, retorna N/A
  if (!hearts?.length) return <span>N/A</span>;

  // Para grupo simples, mostrar todos os números como círculos divididos
  if (betType === "simple_group") {
    // Usar os hearts para criar os pares
    const mainHeart = hearts[0];
    const pairs = hearts.slice(1).map(secondHeart => ({
      firstColor: mainHeart,
      secondColor: secondHeart
    }));

    return (
      <div className="flex flex-wrap gap-1">
        {pairs.map((pair, index) => (
          <SplitCircle 
            key={`${pair.firstColor}-${pair.secondColor}-${index}`}
            firstColor={pair.firstColor}
            secondColor={pair.secondColor}
          />
        ))}
      </div>
    );
  }

  // Para outros tipos de apostas, mostrar círculos individuais para cada cor
  return (
    <div className="flex flex-wrap gap-1">
      {hearts.map((color, index) => (
        <SingleCircle key={`${color}-${index}`} color={color} />
      ))}
    </div>
  );
};