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