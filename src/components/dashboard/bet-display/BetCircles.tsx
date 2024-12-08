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
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    hearts,
    betType,
    isAdmin,
    numbers
  });
  console.log("Hearts array length:", hearts?.length);
  console.log("Numbers array length:", numbers?.length);

  // Se não houver números nem corações, retorna N/A
  if (!numbers?.length && !hearts?.length) {
    console.log("Returning N/A - No numbers and no hearts");
    return <span>N/A</span>;
  }

  // Se houver números, mostra eles
  if (numbers?.length) {
    console.log("Showing numbers:", numbers);
    return <span>{numbers.join(", ")}</span>;
  }

  // Se não houver números mas houver corações, mostra os números correspondentes aos corações
  if (hearts?.length) {
    console.log("Converting hearts to numbers");
    const heartNumbers = hearts.map(heart => {
      const colors = Object.entries(getHeartForNumber);
      const number = colors.find(([_, color]) => color === heart)?.[0];
      console.log(`Converting heart ${heart} to number ${number}`);
      return number || "N/A";
    });
    console.log("Final heart numbers:", heartNumbers);
    return <span>{heartNumbers.join(", ")}</span>;
  }

  console.log("Fallback N/A - No condition met");
  return <span>N/A</span>;
};