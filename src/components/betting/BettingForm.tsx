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

      <AudioPlayer showPlayer={betType === "simple_group"} />

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