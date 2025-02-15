import { useSession } from "@supabase/auth-helpers-react";
import { BetType } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";
import { useBettingState } from "@/hooks/useBettingState";
import { useHeartSelection } from "@/hooks/useHeartSelection";
import { useBetSubmission } from "@/hooks/useBetSubmission";
import { useCallback, useEffect } from "react";

export const useBettingForm = (onBetPlaced: (bet: Bet) => void, initialBetType?: BetType) => {
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

  // Use o tipo inicial de aposta se fornecido
  useEffect(() => {
    if (initialBetType) {
      setBetType(initialBetType);
    }
  }, [initialBetType, setBetType]);

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

  const handleBetTypeChange = useCallback((newBetType: BetType) => {
    setBetType(newBetType);
    setSelectedHearts([]);
    setMainHeart(null);
  }, [setBetType, setSelectedHearts, setMainHeart]);

  const clearSelection = useCallback(() => {
    setSelectedHearts([]);
    setMainHeart(null);
  }, [setSelectedHearts, setMainHeart]);

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
    handleSubmit,
    clearSelection
  };
};