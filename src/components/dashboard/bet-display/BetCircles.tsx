import { BetSequence } from "./BetSequence";

interface BetCirclesProps {
  numbers: string[] | null;
  betType: string;
  isAdmin: boolean;
}

export const BetCircles = ({ numbers, betType, isAdmin }: BetCirclesProps) => {
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    numbers,
    betType,
    isAdmin,
  });

  if (!numbers?.length) return null;

  // Para todos os tipos de aposta, usar BetSequence
  return <BetSequence numbers={numbers} betType={betType} />;
};