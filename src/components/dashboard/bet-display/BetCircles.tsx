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

  // Para grupo simples, mostrar círculo dividido ou único
  if (betType === 'simple_group' && hearts?.length === 2) {
    const [firstColor, secondColor] = hearts;
    const isSameColor = firstColor === secondColor;

    if (isSameColor) {
      // Se as cores são iguais, mostrar um círculo único
      return (
        <div className="flex gap-1">
          <span
            className="inline-block w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: `var(--heart-${firstColor})` }}
            title={`${firstColor}`}
          />
        </div>
      );
    } else {
      // Se as cores são diferentes, mostrar um círculo dividido
      return (
        <div className="flex gap-1">
          <div
            className="inline-block w-4 h-4 rounded-full border border-gray-300 overflow-hidden"
            title={`${firstColor}-${secondColor}`}
          >
            <div className="flex h-full">
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: `var(--heart-${firstColor})` }}
              />
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: `var(--heart-${secondColor})` }}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  // Para todos os outros tipos, mostrar corações normalmente
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