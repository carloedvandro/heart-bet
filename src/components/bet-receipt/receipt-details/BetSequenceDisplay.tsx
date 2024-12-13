import { Bet } from "@/integrations/supabase/custom-types";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface BetSequenceDisplayProps {
  bet: Bet;
}

export const BetSequenceDisplay = ({ bet }: BetSequenceDisplayProps) => {
  // Função para formatar números com dois dígitos
  const formatNumber = (num: number | string) => {
    const parsedNum = typeof num === 'string' ? parseInt(num, 10) : num;
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, mostrar números
  if (bet.bet_type === 'dozen' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(formatNumber).join(", ");
  }

  // Para centena, mostrar números
  if (bet.bet_type === 'hundred' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(formatNumber).join(", ");
  }

  // Para milhar, mostrar números
  if (bet.bet_type === 'thousand' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(formatNumber).join(", ");
  }

  // Para grupo simples, manter o comportamento original
  if (bet.bet_type === 'simple_group' && bet.numbers?.length) {
    return bet.numbers.map(formatNumber).join(", ");
  }

  // Para todos os outros tipos, mostrar corações
  if (bet.hearts?.length) {
    return (
      <div className="flex gap-1 flex-wrap">
        {bet.hearts.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="inline-block w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: `var(--heart-${color})` }}
            title={color}
          />
        ))}
      </div>
    );
  }

  return "N/A";
};