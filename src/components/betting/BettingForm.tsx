import BetForm from "../BetForm";
import { useBettingForm } from "@/hooks/useBettingForm";
import BettingHeartGrid from "./BettingHeartGrid";
import SubmitButton from "./SubmitButton";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetType } from "@/types/betting";
import { Button } from "../ui/button";
import { Eraser, Volume2 } from "lucide-react";
import { toast } from "sonner";

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

  const playRules = () => {
    const audio = new Audio("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Primeiro_selecione_um_coracao_para_formar_o_grupo.mp3");
    audio.volume = 0.7;
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Erro ao reproduzir áudio das regras");
    });
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
        <Button
          variant="outline"
          onClick={playRules}
          className="w-full max-w-[300px] gap-2 mb-4"
        >
          <Volume2 className="w-4 h-4" />
          Clique aqui para ouvir as regras do jogo
        </Button>
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