import { useState, useRef, useEffect } from "react";

export const useAudioPlayer = (audioUrl: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return {
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
  };
};