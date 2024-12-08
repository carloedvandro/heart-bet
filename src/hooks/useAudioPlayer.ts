import { useEffect, useRef, useState } from "react";

export const useAudioPlayer = (audioUrl: string | undefined, showPlayer: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setDuration(0);
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, [audioUrl]);

  useEffect(() => {
    if (!showPlayer) {
      cleanupAudio();
    }
  }, [showPlayer]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        console.log("Audio duration loaded:", audio.duration);
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        setIsPaused(false);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current, isDragging]);

  const playRules = () => {
    cleanupAudio();

    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = 0.7;
      audioRef.current.playbackRate = Number(playbackSpeed);
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsPaused(false);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setIsPaused(false);
          cleanupAudio();
        });
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPaused) {
      audioRef.current.play()
        .then(() => setIsPaused(false))
        .catch(error => {
          console.error("Error resuming audio:", error);
          cleanupAudio();
        });
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleTimeChange = (newTime: number[]) => {
    console.log("Changing time to:", newTime[0]);
    if (audioRef.current && newTime.length > 0) {
      const time = Math.min(newTime[0], duration);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      
      // Se o áudio terminou e o usuário move a barra, reiniciamos a reprodução
      if (!isPlaying) {
        setIsPlaying(true);
        setIsPaused(false);
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio after time change:", error);
            setIsPlaying(false);
            setIsPaused(false);
          });
      }
    }
  };

  const handleSpeedChange = (value: string) => {
    setPlaybackSpeed(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = Number(value);
    }
  };

  return {
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
  };
};