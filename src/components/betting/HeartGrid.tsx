import { HEART_COLORS, BetType } from "@/types/betting";
import HeartButton from "../HeartButton";
import { useEffect, useState } from "react";
import PairsTable from "./PairsTable";

interface HeartGridProps {
  selectedHearts: string[];
  mainHeart: string | null;
  onHeartClick: (color: string) => void;
  betType: BetType;
}

const HeartGrid = ({ selectedHearts, mainHeart, onHeartClick, betType }: HeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState<string[]>([...HEART_COLORS.map(h => h.color)]);

  // Função para embaralhar o array de corações
  const shuffleHearts = () => {
    const shuffled = [...HEART_COLORS.map(h => h.color)].sort(() => Math.random() - 0.5);
    setShuffledHearts(shuffled);
  };

  useEffect(() => {
    shuffleHearts();
    const intervalId = setInterval(shuffleHearts, 3000);
    return () => clearInterval(intervalId);
  }, []);

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
        {shuffledHearts.map((color) => (
          <HeartButton
            key={`${color}-${Date.now()}`}
            color={color}
            selected={selectedHearts.includes(color)}
            isMain={color === mainHeart}
            onClick={() => onHeartClick(color)}
            disabled={false}
          />
        ))}
      </div>
    </div>
  );
};

export default HeartGrid;