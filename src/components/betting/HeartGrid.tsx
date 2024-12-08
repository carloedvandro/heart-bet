import { HEART_COLORS, BetType } from "@/types/betting";
import HeartButton from "../HeartButton";
import { memo } from "react";
import PairsTable from "./PairsTable";

interface HeartGridProps {
  selectedHearts: string[];
  mainHeart: string | null;
  onHeartClick: (color: string) => void;
  betType: BetType;
}

const HeartGrid = memo(({ selectedHearts, mainHeart, onHeartClick, betType }: HeartGridProps) => {
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

      {/* Grade de Corações */}
      <div className="grid grid-cols-5 gap-4">
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

HeartGrid.displayName = 'HeartGrid';

export default HeartGrid;