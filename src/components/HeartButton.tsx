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
      className={cn(
        "relative group transition-all duration-300 ease-in-out",
        "p-4 rounded-full hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected && "animate-heart-beat"
      )}
      style={{ 
        backgroundColor: selected ? `var(--heart-${color})` : 'transparent',
        opacity: selected ? 1 : 0.7
      }}
    >
      <Heart
        className={cn(
          "w-12 h-12 transition-colors duration-300",
          selected ? "fill-current" : "hover:fill-current"
        )}
        style={{ color: `var(--heart-${color})` }}
      />
    </button>
  );
};

export default HeartButton;