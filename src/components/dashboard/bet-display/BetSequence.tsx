interface BetSequenceProps {
  numbers: string[] | null;
  betType: string;
}

export const BetSequence = ({ numbers, betType }: BetSequenceProps) => {
  if (!numbers?.length) return null;

  // Função para formatar números (sem zero à esquerda para dezena e centena)
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    // Para dezena e centena, não usar padStart
    if (betType === 'dozen' || betType === 'hundred') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena e centena, juntar números sem espaço e sem vírgula
  if (betType === 'dozen' || betType === 'hundred') {
    return numbers.map(number => formatNumber(number)).join("");
  }

  // Para outros tipos, manter o comportamento com vírgula e espaço
  return (
    <div className="flex gap-1 flex-wrap">
      {numbers.map((number, index) => (
        <span key={`${number}-${index}`}>
          {formatNumber(number)}
          {index < numbers.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
};