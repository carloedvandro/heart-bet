import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudioPlayerProps {
  showPlayer: boolean;
  audioUrl: string;
}

export const AudioPlayer = ({ showPlayer, audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      return () => {
        audioRef.current?.removeEventListener('timeupdate', updateTime);
      };
    }
  }, [audioRef.current]);

  const playRules = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = 0.7;
      audioRef.current.playbackRate = Number(playbackSpeed);
    }

    setIsPlaying(true);
    setIsPaused(false);
    
    audioRef.current.play()
      .catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setIsPaused(false);
      });

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
      audioRef.current = null;
      setCurrentTime(0);
    };
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (value: string) => {
    setPlaybackSpeed(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = Number(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showPlayer) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px] mb-4">
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
          <Select value={playbackSpeed} onValueChange={handleSpeedChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {isPlaying && (
        <div className="w-full space-y-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};