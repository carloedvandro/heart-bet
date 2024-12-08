import { BetType } from "@/types/betting";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType?: BetType;
}

const PairsTable = ({ mainHeart, selectedPairs, betType = "simple_group" }: PairsTableProps) => {
  const getTableTitle = () => {
    if (betType === "dozen") {
      // Para dezena, contamos todos os corações selecionados
      const selectedCount = selectedPairs.length;
      return `Dezena (${selectedCount}/2)`;
    }
    // Para grupo simples, contamos o coração principal e o segundo coração
    const totalSelected = mainHeart ? selectedPairs.length + 1 : 0;
    return `Números do Grupo (${totalSelected}/2)`;
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