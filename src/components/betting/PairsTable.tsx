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
    const totalSelected = betType === "dozen" 
      ? selectedPairs.length
      : (mainHeart ? selectedPairs.length + 1 : 0);
      
    const maxSelections = betType === "dozen" ? 2 : 2;
    return `${betType === "dozen" ? "Dezena" : "Números do Grupo"} (${totalSelected}/${maxSelections})`;
  };

  const renderDozenContent = () => {
    if (selectedPairs.length === 0) {
      return (
        <div className="text-center py-2 border-t border-gray-100 text-gray-400">
          Selecione os números da dezena
        </div>
      );
    }

    const numbers = selectedPairs.map(getNumberForHeart);
    const formattedDozens = numbers.length === 2 
      ? `${numbers[0]}${numbers[1]}`
      : numbers[0];
    
    return (
      <div className="text-center py-2 border-t border-gray-100">
        <div className="font-bold text-2xl">
          {formattedDozens}
        </div>
        {numbers.length === 2 && (
          <div className="text-sm text-gray-500 mt-1">
            Dezena formada: {formattedDozens}
          </div>
        )}
      </div>
    );
  };

  const renderGroupContent = () => {
    if (!mainHeart) {
      return (
        <div className="text-center py-2 border-t border-gray-100 text-gray-400">
          Selecione o número principal
        </div>
      );
    }
    
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
      {betType === "dozen" ? (
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
          {renderDozenContent()}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center font-medium">Principal</div>
            <div className="text-center font-medium">Par</div>
            <div className="text-center font-medium">Combinação</div>
          </div>
          {renderGroupContent()}
        </>
      )}
    </div>
  );
});

PairsTable.displayName = 'PairsTable';

export default PairsTable;