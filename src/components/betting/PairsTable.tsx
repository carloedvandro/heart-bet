import { BetType } from "@/types/betting";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType?: BetType;
}

const PairsTable = ({ mainHeart, selectedPairs, betType = "simple_group" }: PairsTableProps) => {
  const getTableTitle = () => {
    if (betType === "dozen") {
      // For dozen, we count all selected hearts since there's no main heart
      const selectedCount = selectedPairs.length;
      return `Dezena (${selectedCount}/2)`;
    }
    // For simple_group, we only count the pairs (excluding main heart)
    return `Números do Grupo (${selectedPairs.length}/4)`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <h3 className="text-lg font-medium mb-4">{getTableTitle()}</h3>
      <div className={`grid ${betType === "dozen" ? "grid-cols-1" : "grid-cols-3"} gap-4 text-sm text-gray-600`}>
        {betType !== "dozen" && (
          <>
            <div>Principal</div>
            <div>Par</div>
          </>
        )}
        <div>Combinação</div>
      </div>
    </div>
  );
};

export default PairsTable;