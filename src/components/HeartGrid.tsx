import { useState } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import BettingForm from "./betting/BettingForm";
import BetReceipt from "./BetReceipt";

interface HeartGridProps {
  onBetPlaced?: () => void;
}

const HeartGrid = ({ onBetPlaced }: HeartGridProps) => {
  const [lastBet, setLastBet] = useState<Bet | null>(null);

  const handleBetPlaced = (bet: Bet) => {
    setLastBet(bet);
    onBetPlaced?.();
  };

  const handleReset = () => {
    setLastBet(null);
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {lastBet ? (
        <BetReceipt bet={lastBet} onReset={handleReset} />
      ) : (
        <BettingForm onBetPlaced={handleBetPlaced} />
      )}
    </div>
  );
};

export default HeartGrid;