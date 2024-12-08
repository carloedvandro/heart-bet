import { BetSequence } from "./BetSequence";
import { HeartCircles } from "./HeartCircles";

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers?: string[] | null;
}

export const BetCircles = ({ hearts, betType, isAdmin, numbers }: BetCirclesProps) => {
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    hearts,
    betType,
    isAdmin,
    numbers
  });

  // Primeiro tentar renderizar a sequência de números
  const sequence = <BetSequence numbers={numbers} betType={betType} />;
  if (sequence) return sequence;

  // Se não houver sequência, renderizar os círculos
  return <HeartCircles hearts={hearts} />;
};