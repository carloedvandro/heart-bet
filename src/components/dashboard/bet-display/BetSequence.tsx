interface BetSequenceProps {
  numbers: string[] | null;
  betType: string;
}

export const BetSequence = ({ numbers, betType }: BetSequenceProps) => {
  // Função para formatar números com dois dígitos
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    return parsedNum.toString().padStart(2, '0');
  };

  if (!numbers?.length) return <span>N/A</span>;

  // Mostrar números apenas para grupo simples
  if (betType === 'simple_group') {
    console.log("Showing numbers for simple_group:", numbers);
    return <span>{numbers.map(formatNumber).join(", ")}</span>;
  }

  // Para milhar, manter o comportamento original
  if (betType === 'thousand') {
    console.log("Showing numbers for thousand:", numbers);
    return <span>{numbers.map(formatNumber).join(", ")}</span>;
  }

  return null;
}