import { memo } from "react";
import { BetType } from "@/types/betting";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType?: BetType;
}

const PairsTable = memo(({ mainHeart, selectedPairs, betType = "simple_group" }: PairsTableProps) => {
  const getTableTitle = () => {
    if (betType === "dozen") {
      return `Dezena (${selectedPairs.length}/2)`;
    }
    const totalSelected = mainHeart ? selectedPairs.length + 1 : 0;
    return `Números do Grupo (${totalSelected}/2)`;
  };

  const renderDozenContent = () => {
    const numbers = selectedPairs.map(getNumberForHeart);
    const combination = numbers.length === 2 ? `${numbers[0]}${numbers[1]}` : "";
    
    return (
      <div className="grid grid-cols-1 gap-2">
        {numbers.map((number, index) => (
          <div key={index} className="text-center py-2 border-t border-gray-100 font-medium">
            {number}
          </div>
        ))}
        {combination && (
          <div className="text-center py-2 border-t border-gray-100 font-bold text-lg">
            {combination}
          </div>
        )}
      </div>
    );
  };

  const renderGroupContent = () => {
    if (!mainHeart) return null;
    
    const mainNumber = getNumberForHeart(mainHeart);
    const pairNumber = selectedPairs[0] ? getNumberForHeart(selectedPairs[0]) : "-";
    const combination = selectedPairs[0] ? `${mainNumber}${pairNumber}` : mainNumber;

    return (
      <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
        <div className="text-center font-medium">{mainNumber}</div>
        <div className="text-center font-medium">{pairNumber}</div>
        <div className="text-center font-bold text-lg">{combination}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <h3 className="text-lg font-bold mb-4 text-center">{getTableTitle()}</h3>
      <div className={`grid ${betType === "dozen" ? "grid-cols-1" : "grid-cols-3"} gap-4 text-sm text-gray-600`}>
        {betType !== "dozen" && (
          <>
            <div className="text-center font-medium">Principal</div>
            <div className="text-center font-medium">Par</div>
            <div className="text-center font-medium">Combinação</div>
          </>
        )}
      </div>
      {betType === "dozen" ? renderDozenContent() : renderGroupContent()}
    </div>
  );
});

PairsTable.displayName = 'PairsTable';

export default PairsTable;