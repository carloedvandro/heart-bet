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
    if (betType !== "simple_group" || !mainHeart || selectedHearts.length <= 1) return null;

    // Skip the first heart (main heart) when displaying pairs
    const pairs = selectedHearts.slice(1);

    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Pares formados:</h3>
        <div className="grid grid-cols-2 gap-2">
          {pairs.map((heart, index) => (
            <div 
              key={`${mainHeart}-${heart}-${index}`}
              className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
            >
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: `var(--heart-${mainHeart})` }}
              />
              <span className="text-xl font-bold">+</span>
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: `var(--heart-${heart})` }}
              />
            </div>
          ))}
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
        mainHeart={mainHeart}
        betType={betType}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default BettingForm;