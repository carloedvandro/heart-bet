import BetForm from "../BetForm";
import { useBettingForm } from "./useBettingForm";
import HeartGrid from "./HeartGrid";
import SubmitButton from "./SubmitButton";
import { Bet } from "@/integrations/supabase/custom-types";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
}

const BettingForm = ({ onBetPlaced }: BettingFormProps) => {
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
    handleSubmit
  } = useBettingForm(onBetPlaced);

  const renderPairs = () => {
    if (betType !== "simple_group" || !mainHeart) return null;

    const pairs = selectedHearts
      .filter(heart => heart !== mainHeart)
      .map((heart, index) => {
        const mainNumber = getNumberForHeart(mainHeart);
        const pairNumber = getNumberForHeart(heart);
        const dezena = mainNumber < pairNumber 
          ? `${mainNumber}${pairNumber}`
          : `${pairNumber}${mainNumber}`;
        return (
          <div 
            key={`${heart}-${index}`} 
            className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
          >
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: `var(--heart-${mainHeart})` }}
            />
            <span>+</span>
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: `var(--heart-${heart})` }}
            />
            <span className="text-sm font-medium">=</span>
            <span className="text-sm font-medium">{dezena}</span>
          </div>
        );
      });

    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Pares formados:</h3>
        <div className="grid grid-cols-2 gap-2">
          {pairs}
        </div>
      </div>
    );
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

      <HeartGrid 
        selectedHearts={selectedHearts}
        mainHeart={mainHeart}
        onHeartClick={handleHeartClick}
      />

      {renderPairs()}

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