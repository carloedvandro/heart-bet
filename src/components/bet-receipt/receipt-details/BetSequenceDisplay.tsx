import { Bet } from "@/integrations/supabase/custom-types";

interface BetSequenceDisplayProps {
  bet: Bet;
}

export const BetSequenceDisplay = ({ bet }: BetSequenceDisplayProps) => {
  // Função para formatar números com dois dígitos
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    return parsedNum.toString().padStart(2, '0');
  };

  // Para grupo simples, dezena e milhar, mostrar os números
  if ((bet.bet_type === 'simple_group' || bet.bet_type === 'dozen' || bet.bet_type === 'thousand') && bet.numbers?.length) {
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