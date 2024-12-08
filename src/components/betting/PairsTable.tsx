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
      const selectedCount = selectedPairs.length;
      return `Dezena (${selectedCount}/2)`;
    }
    const totalSelected = mainHeart ? selectedPairs.length + 1 : selectedPairs.length;
    return `Números do Grupo (${totalSelected}/2)`;
  };

  const renderPairs = () => {
    if (betType === "dozen") {
      return selectedPairs.map((heart, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 py-2 border-t border-gray-100">
          <div className="text-center">{getNumberForHeart(heart)}</div>
        </div>
      ));
    }

    // Para grupo simples
    if (mainHeart) {
      return (
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
          <div>{getNumberForHeart(mainHeart)}</div>
          <div>{selectedPairs.length > 0 ? getNumberForHeart(selectedPairs[0]) : "-"}</div>
          <div>
            {mainHeart && selectedPairs.length > 0
              ? `${getNumberForHeart(mainHeart)}${getNumberForHeart(selectedPairs[0])}`
              : "-"}
          </div>
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