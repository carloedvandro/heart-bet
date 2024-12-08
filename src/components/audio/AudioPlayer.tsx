import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { SpeedControl } from "./SpeedControl";
import { TimeControl } from "./TimeControl";

interface AudioPlayerProps {
  showPlayer: boolean;
  audioUrl?: string;
}

export const AudioPlayer = ({ showPlayer, audioUrl }: AudioPlayerProps) => {
  const {
    isPlaying,
    isPaused,
    currentTime,
    duration,
    playbackSpeed,
    isDragging,
    setIsDragging,
    playRules,
    handlePlayPause,
    handleTimeChange,
    handleSpeedChange,
  } = useAudioPlayer(audioUrl, showPlayer);

  if (!showPlayer) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px] mt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={isPlaying ? handlePlayPause : playRules}
          className="flex-1 gap-2"
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Continuar
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            )
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Ouvir regras
            </>
          )}
        </Button>

        {isPlaying && (
          <SpeedControl 
            playbackSpeed={playbackSpeed} 
            onSpeedChange={handleSpeedChange} 
          />
        )}
      </div>

      {isPlaying && (
        <TimeControl
          currentTime={currentTime}
          duration={duration}
          onTimeChange={handleTimeChange}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      )}
    </div>
  );
};