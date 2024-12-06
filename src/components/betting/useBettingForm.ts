import { useSession } from "@supabase/auth-helpers-react";
import { BetType } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";
import { toast } from "sonner";
import { useBettingState } from "@/hooks/useBettingState";
import { useHeartSelection } from "@/hooks/useHeartSelection";
import { useBetSubmission } from "@/hooks/useBetSubmission";

export const useBettingForm = (onBetPlaced: (bet: Bet) => void) => {
  const session = useSession();
  const {
    selectedHearts,
    setSelectedHearts,
    mainHeart,
    setMainHeart,
    betType,
    setBetType,
    drawPeriod,
    setDrawPeriod,
    betAmount,
    setBetAmount,
    position,
    setPosition,
    isSubmitting,
    setIsSubmitting,
  } = useBettingState();

  const { handleHeartClick } = useHeartSelection(
    betType,
    mainHeart,
    selectedHearts,
    setMainHeart,
    setSelectedHearts
  );

  const { handleSubmit } = useBetSubmission(
    session,
    selectedHearts,
    mainHeart,
    betType,
    drawPeriod,
    betAmount,
    position,
    isSubmitting,
    setIsSubmitting,
    onBetPlaced
  );

  const handleBetTypeChange = (newBetType: BetType) => {
    setBetType(newBetType);
    setSelectedHearts([]);
    setMainHeart(null);
    toast.info(`Seleção de corações resetada para ${newBetType === "simple_group" ? "grupo simples" : "nova aposta"}`);
  };

  return {
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
  };
};