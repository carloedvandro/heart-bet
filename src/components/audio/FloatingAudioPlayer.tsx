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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setCurrentTime(0);
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Reset state when audio source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
    setDuration(0);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Force reload of audio when source changes
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || isLoading) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (newValue: number[]) => {
    if (!audioRef.current || isLoading) return;
    const time = newValue[0];
    if (!isNaN(time) && time >= 0 && time <= duration) {
      audioRef.current.currentTime = time;
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

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

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