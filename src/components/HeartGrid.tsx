import { useState } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import BettingForm from "./betting/BettingForm";
import BetReceipt from "./BetReceipt";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface HeartGridProps {
  onBetPlaced?: () => void;
}

const HeartGrid = ({ onBetPlaced }: HeartGridProps) => {
  const [lastBet, setLastBet] = useState<Bet | null>(null);
  const session = useSession();

  const handleReset = () => {
    setLastBet(null);
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {lastBet ? (
        <BetReceipt bet={lastBet} onReset={handleReset} />
      ) : (
        <BettingForm onBetPlaced={onBetPlaced} />
      )}
    </div>
  );
};

export default HeartGrid;