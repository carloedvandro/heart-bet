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

  // Para dezena, mostrar números
  if (betType === 'dozen' && numbers?.length) {
    return <BetSequence numbers={numbers} betType={betType} />;
  }

  // Mostrar números apenas para grupo simples
  if (betType === 'simple_group' && numbers?.length) {
    return <BetSequence numbers={numbers} betType={betType} />;
  }

  // Para milhar, manter o comportamento original
  if (betType === 'thousand' && numbers?.length) {
    return <BetSequence numbers={numbers} betType={betType} />;
  }

  // Para todos os outros tipos, mostrar corações
  return <HeartCircles hearts={hearts} />;
};