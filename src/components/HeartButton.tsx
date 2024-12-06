import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSounds } from "@/utils/soundEffects";

interface HeartButtonProps {
  color: string;
  selected: boolean;
  isMain?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const HeartButton = ({ color, selected, isMain, onClick, disabled }: HeartButtonProps) => {
  const handleClick = () => {
    playSounds.click();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      data-color={color}
      className={cn(
        "group transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected && "animate-heart-beat",
        isMain && "ring-4 ring-heart-pink ring-offset-4 rounded-full"
      )}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Heart
        className={cn(
          "w-16 h-16 transition-all duration-300",
          "fill-current",
          "stroke-black stroke-1 group-hover:scale-105",
          selected ? "scale-110" : "",
          isMain ? "animate-pulse" : "animate-heart-float"
        )}
        style={{
          color: `var(--heart-${color})`,
          filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))",
        }}
      />
    </button>
  );
};

export default HeartButton;