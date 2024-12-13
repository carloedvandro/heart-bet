import { Bet } from "@/integrations/supabase/custom-types";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface BetSequenceDisplayProps {
  bet: Bet;
}

export const BetSequenceDisplay = ({ bet }: BetSequenceDisplayProps) => {
  // Função para formatar números (sem zero à esquerda para dezena e centena)
  const formatNumber = (num: number | string, betType: string) => {
    const parsedNum = typeof num === 'string' ? parseInt(num, 10) : num;
    // Para dezena e centena, não usar padStart
    if (betType === 'dozen' || betType === 'hundred') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena e centena, mostrar números sem vírgula e sem espaço
  if ((bet.bet_type === 'dozen' || bet.bet_type === 'hundred') && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(num => formatNumber(num, bet.bet_type)).join("");
  }

  // Para milhar, mostrar números
  if (bet.bet_type === 'thousand' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(num => formatNumber(num, 'thousand')).join(", ");
  }

  // Para grupo simples, manter o comportamento original
  if (bet.bet_type === 'simple_group' && bet.numbers?.length) {
    return bet.numbers.map(num => formatNumber(num, 'simple_group')).join(", ");
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