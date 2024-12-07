import { Heart } from "lucide-react";

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

  if (!hearts?.length) return <span>N/A</span>;

  if (betType === "simple_group") {
    const mainHeart = hearts[0];
    return (
      <>
        {hearts.slice(1).map((pairHeart, index) => (
          <SplitCircle 
            key={`${mainHeart}-${pairHeart}-${index}`}
            firstColor={mainHeart}
            secondColor={pairHeart}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {hearts.map((color, index) => (
        <SingleCircle key={`${color}-${index}`} color={color} />
      ))}
    </>
  );
};