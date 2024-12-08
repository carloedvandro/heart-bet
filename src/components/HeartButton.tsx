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
        selected && "animate-heart-beat",
        selected && cn(
          "relative",
          "before:absolute before:inset-0",
          "before:content-['']",
          "before:rounded-full",
          "before:border-4",
          "before:border-heart-pink",
          "before:aspect-square",
          isMobile 
            ? "before:w-[calc(100%+12px)] before:-left-[6px] before:-top-[6px]" 
            : "before:w-[calc(100%+20px)] before:-left-[10px] before:-top-[10px]"
        )
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
          "transition-all duration-300",
          "fill-current",
          "stroke-black stroke-1 group-hover:scale-105",
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