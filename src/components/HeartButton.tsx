import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const HeartButton = ({ color, selected, onClick, disabled }: HeartButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-color={color}
      className={cn(
        "relative group transition-all duration-300 ease-in-out",
        "p-4 rounded-full hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-md border-2 border-black/50",
        selected && "animate-heart-beat"
      )}
      style={{ 
        backgroundColor: `var(--heart-${color})`,
        opacity: selected ? 1 : 0.85
      }}
    >
      <Heart
        className={cn(
          "w-12 h-12 transition-colors duration-300",
          "stroke-black stroke-2",
          selected ? "fill-current" : "hover:fill-current"
        )}
        style={{ 
          color: color === 'white' ? 'black' : `var(--heart-${color})`
        }}
      />
    </button>
  );
};

export default HeartButton;