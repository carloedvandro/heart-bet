import { Profile } from "@/integrations/supabase/custom-types";
import { Button } from "@/components/ui/button";
import { LogOut, Volume2, VolumeX } from "lucide-react";
import { BalanceDisplay } from "./BalanceDisplay";
import { RechargeDialog } from "./RechargeDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false); // Changed to false to start unmuted
  const [audio] = useState(new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/background.mp3"));

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.1;

    // Try to play audio immediately when component mounts
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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
    } finally {
      if (onLogout) {
        onLogout();
      }
      localStorage.clear();
      navigate("/login");
      toast.success("Desconectado com sucesso");
    }
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-white">Corações Premiados</h1>
        <BalanceDisplay profile={profile} />
      </div>
      <div className="flex items-center gap-4">
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
        <RechargeDialog />
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="bg-white/90 hover:bg-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}