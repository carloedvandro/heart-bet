interface BetSequenceProps {
  numbers: string[] | null;
  betType: string;
}

export const BetSequence = ({ numbers, betType }: BetSequenceProps) => {
  if (!numbers?.length) return null;

  // Função para formatar números (sem zero à esquerda para dezena)
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    // Para dezena, não usar padStart
    if (betType === 'dozen') {
      return parsedNum.toString();
    }
    // Para outros tipos, manter o formato com dois dígitos
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, juntar números sem espaço e sem vírgula
  if (betType === 'dozen') {
    return (
      <div className="flex gap-1 flex-wrap">
        {numbers.map((number, index) => (
          <span key={`${number}-${index}`}>
            {formatNumber(number)}
          </span>
        ))}
      </div>
    );
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