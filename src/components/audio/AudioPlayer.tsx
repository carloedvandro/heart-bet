import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { TimeControl } from "./TimeControl";

interface AudioPlayerProps {
  showPlayer: boolean;
  audioUrl?: string;
}

export const AudioPlayer = ({ showPlayer, audioUrl }: AudioPlayerProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    playAudio,
    pauseAudio,
    handleTimeChange,
  } = useAudioPlayer(audioUrl, showPlayer);

  if (!showPlayer) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px] mt-4">
      <Button
        variant="outline"
        onClick={isPlaying ? pauseAudio : playAudio}
        className="flex-1 gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            Pausar
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            Ouvir regras
          </>
        )}
      </Button>

      {isPlaying && (
        <TimeControl
          currentTime={currentTime}
          duration={duration}
          onTimeChange={handleTimeChange}
        />
      )}
    </div>
  );
};