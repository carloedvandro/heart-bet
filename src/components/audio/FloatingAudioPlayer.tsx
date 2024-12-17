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

  // Efeito para iniciar a reprodução automaticamente quando o player é aberto
  useEffect(() => {
    if (isOpen && !isPlaying && !isLoading) {
      console.log("Iniciando reprodução automática");
      togglePlay();
    }
  }, [isOpen, isPlaying, isLoading, togglePlay]);

  const handleClose = () => {
    cleanup(); // Chama a função cleanup que agora reseta todos os estados
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 w-80 space-y-4 bg-white/95 backdrop-blur shadow-lg z-50 animate-in slide-in-from-right-1/4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Regras do Jogo</h3>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
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