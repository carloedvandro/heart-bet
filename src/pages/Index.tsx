import { useEffect, useRef, useState } from "react";
import HeartGrid from "@/components/HeartGrid";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const { data } = await supabase.storage
          .from('sounds')
          .getPublicUrl('background.mp3');

        setAudioUrl(data.publicUrl);
      } catch (err) {
        console.error('Unexpected error fetching audio URL:', err);
      }
    };

    fetchAudioUrl();
  }, []);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [audioUrl]);

  const toggleSound = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
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