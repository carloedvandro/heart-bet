import { HEART_COLORS } from "@/types/betting";
import HeartButton from "../HeartButton";
import { useEffect, useState } from "react";

interface HeartGridProps {
  selectedHearts: string[];
  onHeartClick: (color: string) => void;
}

const HeartGrid = ({ selectedHearts, onHeartClick }: HeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState(HEART_COLORS);

  // Função para embaralhar o array de corações
  const shuffleHearts = () => {
    const shuffled = [...HEART_COLORS].sort(() => Math.random() - 0.5);
    setShuffledHearts(shuffled);
  };

  useEffect(() => {
    // Embaralha inicialmente
    shuffleHearts();

    // Configura o intervalo para embaralhar a cada 3 segundos
    const intervalId = setInterval(shuffleHearts, 3000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
      {shuffledHearts.map(({ color }) => (
        <HeartButton
          key={`${color}-${Date.now()}`} // Garante uma key única para forçar re-render
          color={color}
          selected={selectedHearts.includes(color)}
          onClick={() => onHeartClick(color)}
        />
      ))}
    </div>
  );
};

export default HeartGrid;