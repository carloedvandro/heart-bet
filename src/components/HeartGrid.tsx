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

  const fetchLastBet = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching last bet:", error);
        toast.error("Erro ao buscar comprovante");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchLastBet:", error);
      toast.error("Erro ao buscar comprovante");
      return null;
    }
  };

  const handleBetPlaced = async (bet: Bet) => {
    if (!session?.user?.id) {
      toast.error("Usuário não encontrado");
      return;
    }

    // Buscar o último comprovante após a aposta ser registrada
    const lastBet = await fetchLastBet(session.user.id);
    if (lastBet) {
      setLastBet(lastBet);
      onBetPlaced?.();
    }
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