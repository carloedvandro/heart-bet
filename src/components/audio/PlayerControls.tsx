import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
}

const PlayerControls = ({ isPlaying, isLoading, onTogglePlay }: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePlay}
        className="h-12 w-12"
        disabled={isLoading}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default PlayerControls;