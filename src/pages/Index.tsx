import { useEffect, useRef, useState } from "react";
import HeartGrid from "@/components/HeartGrid";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const { data } = await supabase.storage
          .from('sounds')
          .getPublicUrl('background.mp3');

        if (data?.publicUrl) {
          setAudioUrl(data.publicUrl);
          console.log("Audio URL set:", data.publicUrl);
        }
      } catch (err) {
        console.error('Unexpected error fetching audio URL:', err);
        toast.error('Erro ao carregar o áudio');
      }
    };

    fetchAudioUrl();
  }, []);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.1;
      
      audio.addEventListener('canplaythrough', () => {
        console.log("Audio loaded successfully");
        setAudioLoaded(true);
      });

      audio.addEventListener('error', (e) => {
        console.error("Error loading audio:", e);
        toast.error('Erro ao carregar o áudio');
      });

      audioRef.current = audio;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [audioUrl]);

  const toggleSound = () => {
    if (!audioRef.current || !audioLoaded) {
      toast.error('Áudio ainda não está pronto');
      return;
    }
    
    try {
      if (isMuted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playing successfully");
              setIsMuted(false);
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              toast.error('Erro ao reproduzir o áudio');
            });
        }
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      toast.error('Erro ao controlar o áudio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="rounded-full"
              disabled={!audioLoaded}
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-heart-pink to-heart-purple">
            Loteria dos Corações
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha até 5 corações coloridos para sua aposta. Cada cor representa um número
            secreto que será revelado no sorteio.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <HeartGrid />
        </div>
      </div>
    </div>
  );
};

export default Index;