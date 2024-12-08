import { BetType } from "@/types/betting";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType?: BetType;
}

const PairsTable = ({ mainHeart, selectedPairs, betType = "simple_group" }: PairsTableProps) => {
  const getTableTitle = () => {
    if (betType === "dozen") {
      return `Dezena (${selectedPairs.length}/2)`;
    }
    return `Números do Grupo (${selectedPairs.length}/4)`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <h3 className="text-lg font-medium mb-4">{getTableTitle()}</h3>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div>Principal</div>
        <div>Par</div>
        <div>Combinação</div>
      </div>
    </div>
  );
};

export default PairsTable;