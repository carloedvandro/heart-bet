import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (newValue: number[]) => void;
}

const VolumeControl = ({ isMuted, volume, onToggleMute, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onToggleMute}>
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[volume]}
        min={0}
        max={1}
        step={0.1}
        onValueChange={onVolumeChange}
        className="w-24"
      />
    </div>
  );
};

export default VolumeControl;