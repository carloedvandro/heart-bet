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
  console.log("BetCircles - numbers:", numbers);
  console.log("BetCircles - hearts:", hearts);
  console.log("BetCircles - betType:", betType);

  // Se não houver números nem corações, retorna N/A
  if (!numbers?.length && !hearts?.length) {
    return <span>N/A</span>;
  }

  // Se houver números, mostra eles
  if (numbers?.length) {
    return <span>{numbers.join(", ")}</span>;
  }

  // Se não houver números mas houver corações, mostra os números correspondentes aos corações
  if (hearts?.length) {
    const heartNumbers = hearts.map(heart => {
      const colors = Object.entries(getHeartForNumber);
      const number = colors.find(([_, color]) => color === heart)?.[0];
      return number || "N/A";
    });
    return <span>{heartNumbers.join(", ")}</span>;
  }

  return <span>N/A</span>;
};