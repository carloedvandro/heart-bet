interface BetSequenceProps {
  numbers: string[] | null;
  betType: string;
}

export const BetSequence = ({ numbers, betType }: BetSequenceProps) => {
  if (!numbers?.length) return null;

  // Função para formatar números (sem zero à esquerda para dezena, centena e milhar)
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    // Para dezena, centena e milhar, não usar padStart
    if (betType === 'dozen' || betType === 'hundred' || betType === 'thousand') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, centena e milhar, juntar números sem espaço e sem vírgula
  if (betType === 'dozen' || betType === 'hundred' || betType === 'thousand') {
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