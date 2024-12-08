import { memo } from "react";
import { BetType } from "@/types/betting";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType?: BetType;
}

const PairsTable = memo(({ mainHeart, selectedPairs, betType = "simple_group" }: PairsTableProps) => {
  console.log("PairsTable render - selectedPairs:", selectedPairs);
  console.log("PairsTable render - mainHeart:", mainHeart);
  console.log("PairsTable render - betType:", betType);

  const getTableTitle = () => {
    if (betType === "dozen") {
      // Para dezenas, incluímos todos os corações na contagem
      const allSelectedHearts = [...selectedPairs];
      if (mainHeart) allSelectedHearts.push(mainHeart);
      console.log("Total selected hearts:", allSelectedHearts.length);
      return `Dezena (${allSelectedHearts.length}/2)`;
    }
    // Para grupos, contamos o coração principal + pares
    const totalSelected = mainHeart ? selectedPairs.length + 1 : 0;
    return `Números do Grupo (${totalSelected}/2)`;
  };

  const renderDozenContent = () => {
    // Se não houver corações selecionados, mostra mensagem inicial
    const allSelectedHearts = [...selectedPairs];
    if (mainHeart) allSelectedHearts.push(mainHeart);

    if (allSelectedHearts.length === 0) {
      return (
        <div className="text-center py-2 border-t border-gray-100 text-gray-400">
          Selecione os números da dezena
        </div>
      );
    }

    // Converte os corações em números
    const numbers = allSelectedHearts.map(getNumberForHeart);
    console.log("Dozen numbers:", numbers);

    // Formata a dezena
    const formattedDozens = numbers.map(n => n.toString()).join("");

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