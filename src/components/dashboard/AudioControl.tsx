import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

export function AudioControl() {
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/background.mp3"));

  useEffect(() => {
    audio.loop = true;
    
    // Força o volume inicial para 5%
    const setInitialVolume = () => {
      audio.volume = 0.05;
      console.log("Volume inicial definido:", audio.volume);
    };

    // Configura o volume inicial antes de qualquer interação
    setInitialVolume();

    const playAudio = async () => {
      try {
        // Garante que o volume está em 5% antes de iniciar
        setInitialVolume();
        await audio.play();
        console.log("Música de fundo iniciada com volume:", audio.volume);
      } catch (error) {
        console.error("Erro ao reproduzir áudio de fundo:", error);
        setIsMuted(true);
        toast.error("Erro ao reproduzir música de fundo");
      }
    };

    // Só inicia o áudio se não estiver mutado
    if (!isMuted) {
      playAudio();
    }

    // Monitora e corrige alterações no volume
    const handleVolumeChange = () => {
      if (!isMuted && Math.abs(audio.volume - 0.05) > 0.001) {
        console.log("Corrigindo volume para 5%. Volume atual:", audio.volume);
        audio.volume = 0.05;
      }
    };

    // Monitora interações do usuário que podem afetar o volume
    const handleUserInteraction = () => {
      if (!isMuted) {
        setInitialVolume();
      }
    };

    audio.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('mousedown', handleUserInteraction);

    return () => {
      audio.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, isMuted]);

  const toggleSound = () => {
    try {
      if (isMuted) {
        audio.volume = 0.05; // Garante volume em 5% ao desmutar
        audio.play();
        setIsMuted(false);
      } else {
        audio.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Erro ao controlar o áudio:", error);
      toast.error("Erro ao controlar o áudio");
    }
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