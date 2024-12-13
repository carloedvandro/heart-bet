import { Bet } from "@/integrations/supabase/custom-types";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface BetSequenceDisplayProps {
  bet: Bet;
}

export const BetSequenceDisplay = ({ bet }: BetSequenceDisplayProps) => {
  // Função para formatar números com dois dígitos (exceto para dezena)
  const formatNumber = (num: number | string, betType: string) => {
    const parsedNum = typeof num === 'string' ? parseInt(num, 10) : num;
    // Para dezena, não usar padStart
    if (betType === 'dozen') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, mostrar números sem zero à esquerda e sem vírgula
  if (bet.bet_type === 'dozen' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(num => formatNumber(num, 'dozen')).join("");
  }

  // Para centena, mostrar números
  if (bet.bet_type === 'hundred' && bet.hearts?.length) {
    const numbers = bet.hearts.map(heart => getNumberForHeart(heart).toString());
    return numbers.map(num => formatNumber(num, 'hundred')).join(", ");
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