import { useAdminStatus } from "@/hooks/useAdminStatus";

interface BetCirclesProps {
  hearts: string[] | null;
  betType: string;
  isAdmin: boolean;
  numbers?: number[] | null;
}

export const BetCircles = ({ hearts, betType, isAdmin, numbers }: BetCirclesProps) => {
  console.log("=== BetCircles Component Debug ===");
  console.log("Input props:", {
    hearts,
    betType,
    isAdmin,
    numbers
  });

  // Sempre mostrar os números se disponíveis
  if (numbers?.length) {
    console.log("Showing numbers:", numbers);
    return <span>{numbers.join(", ")}</span>;
  }

  // Fallback para exibição dos corações
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