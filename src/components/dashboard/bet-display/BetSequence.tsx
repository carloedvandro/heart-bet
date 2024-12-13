interface BetSequenceProps {
  numbers: string[] | null;
  betType: string;
}

export const BetSequence = ({ numbers, betType }: BetSequenceProps) => {
  if (!numbers?.length) return null;

  // Função para formatar números com dois dígitos
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    return parsedNum.toString().padStart(2, '0');
  };

  // Para dezena, mostrar apenas o primeiro número formatado
  if (betType === 'dozen') {
    return (
      <div className="flex gap-1 flex-wrap">
        <span>{formatNumber(numbers[0])}</span>
      </div>
    );
  }

  // Para outros tipos, manter o comportamento original
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