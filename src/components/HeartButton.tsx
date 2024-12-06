import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const HeartButton = ({ color, selected, onClick, disabled }: HeartButtonProps) => {
  const playClickSound = () => {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = 0.3; // Reduz o volume para 30%
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
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
        selected && "animate-heart-beat"
      )}
      style={{
        border: "none",
        background: "none",
        padding: 0,
      }}
    >
      <Heart
        className={cn(
          "w-16 h-16 transition-all duration-300",
          "fill-current",
          "stroke-black stroke-1 group-hover:scale-105",
          selected ? "scale-110" : ""
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