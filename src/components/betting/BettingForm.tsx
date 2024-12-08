import BetForm from "../BetForm";
import { useBettingForm } from "@/hooks/useBettingForm";
import BettingHeartGrid from "./BettingHeartGrid";
import SubmitButton from "./SubmitButton";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetType } from "@/types/betting";
import { Button } from "../ui/button";
import { Eraser, Pause, Play, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
  initialBetType?: BetType;
}

const BettingForm = ({ onBetPlaced, initialBetType }: BettingFormProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    selectedHearts,
    mainHeart,
    betType,
    drawPeriod,
    betAmount,
    position,
    isSubmitting,
    session,
    handleHeartClick,
    handleBetTypeChange,
    setDrawPeriod,
    setBetAmount,
    setPosition,
    handleSubmit,
    clearSelection
  } = useBettingForm(onBetPlaced, initialBetType);

  const handleClearSelection = () => {
    clearSelection();
    toast.info("Seleção de corações limpa");
  };

  const playRules = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Primeiro_selecione_um_coracao_para_formar_o_grupo2.mp3");
      audioRef.current.volume = 0.7;
    }

    setIsPlaying(true);
    setIsPaused(false);
    
    audioRef.current.play()
      .catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Erro ao reproduzir áudio das regras");
        setIsPlaying(false);
        setIsPaused(false);
      });

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
      audioRef.current = null;
    };
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <>
      <BetForm
        betType={betType}
        setBetType={handleBetTypeChange}
        drawPeriod={drawPeriod}
        setDrawPeriod={setDrawPeriod}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        position={position}
        setPosition={setPosition}
      />

      {betType === "simple_group" && (
        <div className="flex gap-2 w-full max-w-[300px] mb-4">
          <Button
            variant="outline"
            onClick={isPlaying ? handlePlayPause : playRules}
            disabled={false}
            className="flex-1 gap-2"
          >
            {isPlaying ? (
              isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Continuar
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar
                </>
              )
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Ouvir regras
              </>
            )}
          </Button>
        </div>
      )}

      <BettingHeartGrid 
        selectedHearts={selectedHearts}
        mainHeart={mainHeart}
        onHeartClick={handleHeartClick}
        betType={betType}
      />

      <div className="flex flex-col gap-4 items-center">
        <SubmitButton
          session={session}
          selectedHearts={selectedHearts}
          mainHeart={mainHeart}
          betType={betType}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <Button
          variant="outline"
          onClick={handleClearSelection}
          className="w-full max-w-[200px] gap-2"
        >
          <Eraser className="w-4 h-4" />
          Limpar Seleção
        </Button>
      </div>
    </>
  );
};

export default BettingForm;