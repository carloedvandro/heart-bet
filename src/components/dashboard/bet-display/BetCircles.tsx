import { BetSequence } from "./BetSequence";

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers: string[] | null;
}

export const BetCircles = ({ numbers, betType }: BetCirclesProps) => {
  console.log("BetCircles - Received numbers:", numbers);
  console.log("BetCircles - Bet type:", betType);
  
  if (!numbers?.length) {
    return <span className="text-gray-500">Aguardando processamento</span>;
  }

  return <BetSequence numbers={numbers} betType={betType} />;
};