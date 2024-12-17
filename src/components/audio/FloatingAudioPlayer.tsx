import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PlayerControls from "./PlayerControls";
import TimeSlider from "./TimeSlider";
import VolumeControl from "./VolumeControl";
import { useAudioPlayer } from "./useAudioPlayer";
import { useEffect } from "react";

interface FloatingAudioPlayerProps {
  audioUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloatingAudioPlayer = ({ audioUrl, isOpen, onClose }: FloatingAudioPlayerProps) => {
  const {
    isPlaying,
    isMuted,
    duration,
    currentTime,
    volume,
    isLoading,
    togglePlay,
    toggleMute,
    handleTimeChange,
    handleVolumeChange,
    cleanup
  } = useAudioPlayer(audioUrl);

  useEffect(() => {
    if (isOpen && !isPlaying && !isLoading) {
      console.log("Iniciando reprodução automática");
      togglePlay();
    }
  }, [isOpen, isPlaying, isLoading, togglePlay]);

  const handleClose = () => {
    cleanup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 w-80 space-y-4 dark:bg-gray-800/95 bg-white/95 backdrop-blur shadow-lg z-50 animate-in slide-in-from-right-1/4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium dark:text-white">Regras do Jogo</h3>
        <Button variant="ghost" size="icon" onClick={handleClose} className="dark:hover:bg-gray-700">
          <X className="h-4 w-4 dark:text-white" />
        </Button>
      </div>

      <div className="space-y-4">
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTogglePlay={togglePlay}
        />

        <TimeSlider
          currentTime={currentTime}
          duration={duration}
          isLoading={isLoading}
          onTimeChange={handleTimeChange}
        />

        <VolumeControl
          isMuted={isMuted}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </Card>
  );
};

export default FloatingAudioPlayer;