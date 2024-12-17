import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSounds } from "@/utils/soundEffects";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeartButtonProps {
  color: string;
  selected: boolean;
  isMain?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const HeartButton = ({ color, selected, isMain, onClick, disabled }: HeartButtonProps) => {
  const isMobile = useIsMobile();
  
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
        "group relative transition-all duration-300 ease-in-out",
        "focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected && "animate-heart-beat"
      )}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Container para o anel de seleção */}
      <div
        className={cn(
          "absolute -inset-3 rounded-full transition-opacity",
          "border-4 border-heart-pink",
          selected ? "opacity-100" : "opacity-0",
          isMobile ? "scale-90" : "scale-100"
        )}
      />
      
      {/* Ícone do coração */}
      <Heart
        className={cn(
          "relative z-10",
          "transition-all duration-300",
          "fill-current",
          "dark:stroke-white/70 stroke-black stroke-1 group-hover:scale-105",
          selected ? "scale-110" : "",
          isMain && "animate-pulse",
          isMobile ? "w-10 h-10" : "w-16 h-16"
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