import { HEART_COLORS, BetType } from "@/types/betting";
import HeartButton from "../HeartButton";
import { memo } from "react";
import PairsTable from "./PairsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface BettingHeartGridProps {
  selectedHearts: string[];
  mainHeart: string | null;
  onHeartClick: (color: string) => void;
  betType: BetType;
}

const BettingHeartGrid = memo(({ selectedHearts, mainHeart, onHeartClick, betType }: BettingHeartGridProps) => {
  const getDozenNumber = () => {
    if (selectedHearts.length !== 2) return "";
    const firstNumber = getNumberForHeart(selectedHearts[0]);
    const secondNumber = getNumberForHeart(selectedHearts[1]);
    return `${firstNumber}${secondNumber}`;
  };

  return (
    <div className="flex flex-col gap-8 items-center animate-fade-in">
      {/* Tabela de Visualização */}
      <div className="w-full max-w-md">
        {betType === "simple_group" ? (
          <PairsTable 
            mainHeart={mainHeart} 
            selectedPairs={selectedHearts.slice(1)} 
            betType={betType}
          />
        ) : betType === "dozen" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Dezena</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-lg font-semibold">
                  {selectedHearts.length === 0 ? (
                    <span className="text-gray-500">Selecione os corações</span>
                  ) : (
                    <span>{getDozenNumber()}</span>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : null}
      </div>

      {/* Grade de Corações */}
      <div className="grid grid-cols-5 gap-4 w-full">
        {HEART_COLORS.map((heartColor) => (
          <HeartButton
            key={heartColor.color}
            color={heartColor.color}
            selected={selectedHearts.includes(heartColor.color)}
            isMain={heartColor.color === mainHeart}
            onClick={() => onHeartClick(heartColor.color)}
            disabled={false}
          />
        ))}
      </div>
    </div>
  );
});

BettingHeartGrid.displayName = 'BettingHeartGrid';

export default BettingHeartGrid;