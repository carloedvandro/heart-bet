import BetForm from "../BetForm";
import { useBettingForm } from "./useBettingForm";
import HeartGrid from "./HeartGrid";
import SubmitButton from "./SubmitButton";
import { Bet } from "@/integrations/supabase/custom-types";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
}

const BettingForm = ({ onBetPlaced }: BettingFormProps) => {
  const {
    selectedHearts,
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
    handleSubmit
  } = useBettingForm(onBetPlaced);

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

      <HeartGrid 
        selectedHearts={selectedHearts}
        onHeartClick={handleHeartClick}
      />

      <SubmitButton
        session={session}
        selectedHearts={selectedHearts}
        betType={betType}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default BettingForm;