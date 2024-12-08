import { HEART_COLORS, BetType } from "@/types/betting";
import HeartButton from "../HeartButton";
import { memo, useEffect, useState } from "react";
import PairsTable from "./PairsTable";

interface BettingHeartGridProps {
  selectedHearts: string[];
  mainHeart: string | null;
  onHeartClick: (color: string) => void;
  betType: BetType;
}

const BettingHeartGrid = memo(({ selectedHearts, mainHeart, onHeartClick, betType }: BettingHeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState(HEART_COLORS);

  const shuffleHearts = () => {
    const newHearts = [...HEART_COLORS];
    for (let i = newHearts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newHearts[i], newHearts[j]] = [newHearts[j], newHearts[i]];
    }
    setShuffledHearts(newHearts);
  };

  // Embaralhar corações inicialmente
  useEffect(() => {
    shuffleHearts();
  }, []);

  // Embaralhar corações a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      shuffleHearts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 items-center animate-fade-in">
      {/* Tabela de Visualização */}
      <div className="w-full max-w-md">
        <PairsTable 
          mainHeart={mainHeart} 
          selectedPairs={selectedHearts} 
          betType={betType}
        />
      </div>

      {/* Grade de Corações */}
      <div className="grid grid-cols-5 gap-4 w-full">
        {shuffledHearts.map((heartColor) => (
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