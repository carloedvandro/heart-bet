import { HEART_COLORS } from "@/types/betting";
import HeartButton from "../HeartButton";

interface HeartGridProps {
  selectedHearts: string[];
  onHeartClick: (color: string) => void;
}

const HeartGrid = ({ selectedHearts, onHeartClick }: HeartGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
      {HEART_COLORS.map(({ color }) => (
        <HeartButton
          key={color}
          color={color}
          selected={selectedHearts.includes(color)}
          onClick={() => onHeartClick(color)}
        />
      ))}
    </div>
  );
};

export default HeartGrid;