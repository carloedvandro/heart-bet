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

  console.log("BetSequence - Formatting numbers:", numbers);
  console.log("BetSequence - Bet type:", betType);

  return (
    <div className="flex gap-1 flex-wrap">
      {numbers.map((number, index) => (
        <span key={`${number}-${index}`} className="font-mono">
          {formatNumber(number)}
          {index < numbers.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
};