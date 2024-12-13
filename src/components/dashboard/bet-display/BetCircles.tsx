import { BetSequence } from "./BetSequence";

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers: string[] | null;
}

export const BetCircles = ({ numbers, betType }: BetCirclesProps) => {
  return <BetSequence numbers={numbers} betType={betType} />;
};