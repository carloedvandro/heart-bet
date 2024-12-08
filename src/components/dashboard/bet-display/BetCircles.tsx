interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers?: string[] | null;
}

export const BetCircles = ({ hearts, betType, isAdmin, numbers }: BetCirclesProps) => {
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    hearts,
    betType,
    isAdmin,
    numbers
  });

  // Função para formatar números com dois dígitos
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    return parsedNum.toString().padStart(2, '0');
  };

  // Mostrar números apenas para milhar (thousand)
  if (betType === 'thousand' && numbers?.length) {
    console.log("Showing numbers for thousand:", numbers);
    return <span>{numbers.map(formatNumber).join(", ")}</span>;
  }

  // Para todos os outros tipos, mostrar corações
  if (hearts?.length) {
    return (
      <div className="flex gap-1 flex-wrap">
        {hearts.map((color, index) => (
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

  return <span>N/A</span>;
};