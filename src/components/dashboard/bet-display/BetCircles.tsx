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

  if (!hearts?.length) return <span>N/A</span>;

  // Para grupo simples, mostrar todos os números como círculos divididos
  if (betType === "simple_group") {
    // Criar pares de cores baseados no coração principal e os outros corações
    const pairs = [];
    const mainHeart = hearts[0];
    
    // Se tivermos apenas um coração, ele forma par com ele mesmo
    if (hearts.length === 1) {
      pairs.push({ firstColor: mainHeart, secondColor: mainHeart });
    } else {
      // Para cada coração adicional além do principal, criar um par
      for (let i = 1; i < hearts.length; i++) {
        pairs.push({
          firstColor: mainHeart,
          secondColor: hearts[i]
        });
      }
    }

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