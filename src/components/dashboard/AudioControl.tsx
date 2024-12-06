import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

export function AudioControl() {
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/background.mp3"));

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.05; // Ajustado para 5%

    const playAudio = async () => {
      try {
        await audio.play();
        console.log("Background music started playing");
      } catch (error) {
        console.error("Error playing background audio:", error);
        setIsMuted(true);
        toast.error("Erro ao reproduzir música de fundo");
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleSound = async () => {
    try {
      if (isMuted) {
        await audio.play();
        setIsMuted(false);
      } else {
        audio.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
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