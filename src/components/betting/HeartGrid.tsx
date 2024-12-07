import { HEART_COLORS } from "@/types/betting";
import HeartButton from "../HeartButton";
import { useEffect, useState } from "react";
import PairsTable from "./PairsTable";

interface HeartGridProps {
  selectedHearts: string[];
  mainHeart: string | null;
  onHeartClick: (color: string) => void;
}

type HeartColor = typeof HEART_COLORS[number];

const HeartGrid = ({ selectedHearts, mainHeart, onHeartClick }: HeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState<HeartColor[]>([...HEART_COLORS]);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);

  // Função para embaralhar o array de corações
  const shuffleHearts = () => {
    const shuffled = [...HEART_COLORS].sort(() => Math.random() - 0.5);
    setShuffledHearts(shuffled as HeartColor[]);
  };

  // Atualiza os pares selecionados quando selectedHearts muda
  useEffect(() => {
    if (selectedHearts.length > 1) {
      // Pega apenas os pares (exclui o coração principal)
      const pairs = selectedHearts.slice(1);
      setSelectedPairs(pairs);
    } else {
      setSelectedPairs([]);
    }
  }, [selectedHearts]);

  useEffect(() => {
    shuffleHearts();
    const intervalId = setInterval(shuffleHearts, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const isHeartDisabled = (color: string) => {
    // Se não há coração principal selecionado, nenhum coração deve estar desabilitado
    if (!mainHeart) return false;
    
    // Se o coração clicado já foi usado em um par, deve estar desabilitado
    const pairs = selectedHearts.slice(1);
    if (pairs.includes(color)) return true;
    
    // Se já temos 4 pares, deve estar desabilitado (exceto o principal)
    if (pairs.length >= 4 && color !== mainHeart) return true;
    
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
      {/* Tabela de Pares */}
      <div className="w-full md:w-1/3">
        <PairsTable mainHeart={mainHeart} selectedPairs={selectedPairs} />
      </div>

      {/* Grade de Corações */}
      <div className="w-full md:w-2/3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {shuffledHearts.map(({ color }) => (
            <HeartButton
              key={`${color}-${Date.now()}`}
              color={color}
              selected={selectedHearts.includes(color)}
              isMain={color === mainHeart}
              onClick={() => onHeartClick(color)}
              disabled={isHeartDisabled(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeartGrid;