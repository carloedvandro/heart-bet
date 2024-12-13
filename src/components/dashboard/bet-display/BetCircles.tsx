import { BetSequence } from "./BetSequence";
import { HeartCircles } from "./HeartCircles";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

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
    numbers,
    mappedNumbers: hearts?.map(heart => getNumberForHeart(heart))
  });

  // Para dezena, mostrar números
  if (betType === 'dozen' && hearts?.length) {
    const mappedNumbers = hearts.map(heart => getNumberForHeart(heart).toString());
    return <BetSequence numbers={mappedNumbers} betType={betType} />;
  }

  // Para centena, mostrar números
  if (betType === 'hundred' && hearts?.length) {
    const mappedNumbers = hearts.map(heart => getNumberForHeart(heart).toString());
    return <BetSequence numbers={mappedNumbers} betType={betType} />;
  }

  // Para milhar, mostrar números
  if (betType === 'thousand' && hearts?.length) {
    const mappedNumbers = hearts.map(heart => getNumberForHeart(heart).toString());
    return <BetSequence numbers={mappedNumbers} betType={betType} />;
  }

  // Para grupo simples, manter o comportamento original
  if (betType === 'simple_group' && numbers?.length) {
    return <BetSequence numbers={numbers} betType={betType} />;
  }

  // Para todos os outros tipos, mostrar corações
  return <HeartCircles hearts={hearts} />;
};