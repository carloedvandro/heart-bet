import { HEART_COLORS, BetType } from "@/types/betting";
import HeartButton from "../HeartButton";
import { memo, useEffect, useState } from "react";
import PairsTable from "./PairsTable";

interface BettingHeartGridProps {
  betType: BetType;
  drawPeriod: string;
  betAmount: number;
  position: number;
}

const BettingHeartGrid = memo(({ betType }: BettingHeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState([...HEART_COLORS]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [mainHeart, setMainHeart] = useState<string | null>(null);

  const shuffleHearts = () => {
    setIsShuffling(true);
    setShuffledHearts(hearts => {
      const newHearts = [...hearts];
      for (let i = newHearts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newHearts[i], newHearts[j]] = [newHearts[j], newHearts[i]];
      }
      return newHearts;
    });
    setTimeout(() => setIsShuffling(false), 500);
  };

  const handleHeartClick = (color: string) => {
    if (selectedHearts.includes(color)) {
      setSelectedHearts(prev => prev.filter(h => h !== color));
      if (mainHeart === color) {
        setMainHeart(null);
      }
    } else {
      setSelectedHearts(prev => [...prev, color]);
    }
  };

  useEffect(() => {
    shuffleHearts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      shuffleHearts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 items-center animate-fade-in">
      <div className="w-full max-w-md">
        <PairsTable 
          mainHeart={mainHeart} 
          selectedPairs={selectedHearts} 
          betType={betType}
        />
      </div>

      <div className="grid grid-cols-5 gap-4 w-full">
        {shuffledHearts.map((heartColor, index) => (
          <div
            key={heartColor.color}
            className={isShuffling ? "animate-deal-card" : ""}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <HeartButton
              color={heartColor.color}
              selected={selectedHearts.includes(heartColor.color)}
              isMain={heartColor.color === mainHeart}
              onClick={() => handleHeartClick(heartColor.color)}
              disabled={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

BettingHeartGrid.displayName = 'BettingHeartGrid';

export default BettingHeartGrid;