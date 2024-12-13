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

  console.log("BetSequenceDisplay - Bet data:", {
    type: bet.bet_type,
    numbers: bet.numbers,
    hearts: bet.hearts
  });

  // Se tivermos números, mostramos eles diretamente
  if (bet.numbers?.length) {
    return bet.numbers.map(formatNumber).join(", ");
  }

  return "N/A";
};