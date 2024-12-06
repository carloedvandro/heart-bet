import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

export function AudioControl() {
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuteState = localStorage.getItem('audioMuted');
    return savedMuteState ? JSON.parse(savedMuteState) : false;
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Criar o elemento de áudio apenas uma vez
    if (!audioRef.current) {
      const audio = new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/background.mp3");
      audio.loop = true;
      audio.volume = 0.05;
      audioRef.current = audio;
      setIsInitialized(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || !audioRef.current) return;

    const audio = audioRef.current;
    
    if (!isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Erro ao reproduzir áudio:", error);
          setIsMuted(true);
          localStorage.setItem('audioMuted', 'true');
          toast.error("Erro ao reproduzir música de fundo");
        });
      }
    } else {
      audio.pause();
    }

    // Monitora alterações no volume
    const handleVolumeChange = () => {
      if (!isMuted && audio.volume !== 0.05) {
        console.log("Ajustando volume para 5%");
        audio.volume = 0.05;
      }
    };

    audio.addEventListener('volumechange', handleVolumeChange);
    return () => {
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [isMuted, isInitialized]);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    localStorage.setItem('audioMuted', (!isMuted).toString());
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSound}
      className="bg-white/90 hover:bg-white"
    >
      {isMuted ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}