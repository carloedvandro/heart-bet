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
  return (
    <div className="flex flex-col gap-8 items-center animate-fade-in">
      {/* Tabela de Pares */}
      <div className="w-full max-w-md">
        <PairsTable 
          mainHeart={mainHeart} 
          selectedPairs={selectedHearts.slice(1)} 
          betType={betType}
        />
      </div>

      <div className="flex gap-8 items-start w-full">
        {/* Grade de Corações */}
        <div className="grid grid-cols-5 gap-4 flex-1">
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

        {/* Tabela de Visualização */}
        <div className="w-48">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Números</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-lg font-semibold">
                  {selectedHearts.length === 0 ? (
                    <span className="text-gray-500">Selecione os corações</span>
                  ) : (
                    <div className="flex justify-center gap-1">
                      {selectedHearts.map((heart, index) => (
                        <span key={index}>{getNumberForHeart(heart)}</span>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
});

BettingHeartGrid.displayName = 'BettingHeartGrid';

export default BettingHeartGrid;