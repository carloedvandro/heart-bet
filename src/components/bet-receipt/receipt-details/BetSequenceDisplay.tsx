import { Bet } from "@/integrations/supabase/custom-types";

interface BetSequenceDisplayProps {
  bet: Bet;
}

export const BetSequenceDisplay = ({ bet }: BetSequenceDisplayProps) => {
  if (!bet.numbers?.length) return null;

  // Função para formatar números (sem zero à esquerda para dezena, centena e milhar)
  const formatNumber = (num: string, betType: string) => {
    const parsedNum = parseInt(num, 10);
    // Para dezena, centena e milhar, não usar padStart
    if (betType === 'dozen' || betType === 'hundred' || betType === 'thousand') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, centena e milhar, mostrar números sem vírgula e sem espaço
  if (bet.bet_type === 'dozen' || bet.bet_type === 'hundred' || bet.bet_type === 'thousand') {
    return bet.numbers.map(num => formatNumber(num, bet.bet_type)).join("");
  }

  // Para grupo simples, manter o comportamento original com vírgulas
  return bet.numbers.map(num => formatNumber(num, bet.bet_type)).join(", ");
};