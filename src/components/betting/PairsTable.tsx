import { BetType } from "@/types/betting";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

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
    
    // Para grupo simples, contamos o coração principal como uma seleção
    const totalSelected = mainHeart ? 1 + (selectedPairs.length > 0 ? 1 : 0) : 0;
    return `Números do Grupo (${totalSelected}/2)`;
  };

  const renderPairs = () => {
    if (betType === "dozen") {
      return (
        <div className="grid grid-cols-1 gap-2">
          {selectedPairs.map((heart, index) => (
            <div key={index} className="text-center py-2 border-t border-gray-100">
              {getNumberForHeart(heart)}
            </div>
          ))}
          {selectedPairs.length === 2 && (
            <div className="text-center py-2 border-t border-gray-100 font-semibold">
              {getNumberForHeart(selectedPairs[0])}{getNumberForHeart(selectedPairs[1])}
            </div>
          )}
        </div>
      );
    }

    // Para grupo simples
    if (mainHeart) {
      const mainNumber = getNumberForHeart(mainHeart);
      const secondNumber = selectedPairs.length > 0 ? getNumberForHeart(selectedPairs[0]) : "-";
      const combination = selectedPairs.length > 0 
        ? `${mainNumber}${secondNumber}`
        : "-";

      return (
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
          <div>{mainNumber}</div>
          <div>{secondNumber}</div>
          <div>{combination}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <h3 className="text-lg font-medium mb-4">{getTableTitle()}</h3>
      <div className={`grid ${betType === "dozen" ? "grid-cols-1" : "grid-cols-3"} gap-4 text-sm text-gray-600`}>
        {betType !== "dozen" && (
          <>
            <div>Principal</div>
            <div>Par</div>
            <div>Combinação</div>
          </>
        )}
      </div>
      {renderPairs()}
    </div>
  );
};

export default PairsTable;