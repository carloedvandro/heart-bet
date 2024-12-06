import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HeartButtonProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const HeartButton = ({ color, selected, onClick, disabled }: HeartButtonProps) => {
  const playClickSound = async () => {
    try {
      const audio = new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/click.mp3");
      audio.volume = 0.7; // Aumentado para 70%
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing click sound:", error);
          toast.error("Erro ao reproduzir som de clique");
        });
      }
    } catch (error) {
      console.error("Error creating audio:", error);
    }
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