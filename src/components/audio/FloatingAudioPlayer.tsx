import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface FloatingAudioPlayerProps {
  audioUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloatingAudioPlayer = ({ audioUrl, isOpen, onClose }: FloatingAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Efeito para inicializar e limpar o áudio
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      console.log("Áudio metadata carregada:", audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      console.log("Áudio iniciou reprodução");
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Áudio pausado");
      setIsPlaying(false);
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Erro no áudio:", e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Efeito para controlar o volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Garantir que o áudio está pronto antes de tentar reproduzir
        if (audio.readyState < 3) {
          setIsLoading(true);
          await new Promise((resolve, reject) => {
            const loadedHandler = () => {
              resolve(true);
              audio.removeEventListener('canplaythrough', loadedHandler);
            };
            const errorHandler = (e: ErrorEvent) => {
              reject(e);
              audio.removeEventListener('error', errorHandler);
            };
            audio.addEventListener('canplaythrough', loadedHandler);
            audio.addEventListener('error', errorHandler);
          });
          setIsLoading(false);
        }

        await audio.play();
      }
    } catch (error) {
      console.error("Erro ao controlar reprodução:", error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (newValue: number[]) => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;
    
    const time = newValue[0];
    if (!isNaN(time) && time >= 0 && time <= duration) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 w-80 space-y-4 bg-white/95 backdrop-blur shadow-lg z-50 animate-in slide-in-from-right-1/4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Regras do Jogo</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
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

        <div className="space-y-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange}
            disabled={isLoading}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
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
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </Card>
  );
};

export default FloatingAudioPlayer;