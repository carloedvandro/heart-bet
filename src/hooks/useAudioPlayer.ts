import { useEffect, useRef, useState } from "react";

export const useAudioPlayer = (audioUrl: string | undefined, showPlayer: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!showPlayer) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [showPlayer]);

  const initializeAudio = () => {
    if (!audioUrl) return;
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = 0.7;
    
    audioRef.current.addEventListener('loadedmetadata', () => {
      console.log('Audio loaded, duration:', audioRef.current?.duration);
      setDuration(audioRef.current?.duration || 0);
    });

    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    });

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    });
  };

  const playAudio = () => {
    if (!audioRef.current) {
      initializeAudio();
    }
    
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeChange = (newTime: number[]) => {
    if (audioRef.current && newTime.length > 0) {
      const time = Math.min(newTime[0], duration);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      
      if (!isPlaying) {
        playAudio();
      }
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    playAudio,
    pauseAudio,
    handleTimeChange,
  };
};