import BetForm from "../BetForm";
import { useBettingForm } from "@/hooks/useBettingForm";
import BettingHeartGrid from "./BettingHeartGrid";
import SubmitButton from "./SubmitButton";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetType } from "@/types/betting";
import { Button } from "../ui/button";
import { Eraser } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "../audio/AudioPlayer";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
  initialBetType?: BetType;
}

const BettingForm = ({ onBetPlaced, initialBetType }: BettingFormProps) => {
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

  const showAudioPlayer = betType === "simple_group" || betType === "dozen";
  const audioUrl = betType === "dozen" 
    ? "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Regras_da_dezena.mp3"
    : "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Primeiro_selecione_um_coracao_para_formar_o_grupo3.mp3";

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

      <AudioPlayer 
        showPlayer={showAudioPlayer}
        audioUrl={audioUrl}
      />

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