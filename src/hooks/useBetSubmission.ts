import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { BetType, DrawPeriod, Position } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";
import { useTemporaryBetState } from "./useTemporaryBetState";

export const useBetSubmission = (
  session: Session | null,
  selectedHearts: string[],
  mainHeart: string | null,
  betType: BetType,
  drawPeriod: DrawPeriod,
  betAmount: number,
  position: Position,
  isSubmitting: boolean,
  setIsSubmitting: (value: boolean) => void,
  onBetPlaced: (bet: Bet) => void
) => {
  const navigate = useNavigate();
  const { combinations, clearCombinations } = useTemporaryBetState();

  const checkBalance = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error checking balance:", error);
      return false;
    }

    return profile?.balance >= betAmount;
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    const hasBalance = await checkBalance(session.user.id);
    if (!hasBalance) {
      playSounds.error();
      toast.error("Saldo insuficiente para realizar esta aposta. Por favor, faça uma recarga.");
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting bet with combinations:", combinations);

    try {
      const { data, error } = await supabase
        .from('bets')
        .insert({
          user_id: session.user.id,
          hearts: selectedHearts,
          numbers: combinations.map(String),
          bet_type: betType,
          draw_period: drawPeriod,
          amount: betAmount,
          position: position,
        })
        .select('*, profiles:profiles(balance)')
        .single();

      if (error) {
        console.error("Supabase error:", error);
        if (error.message.includes('Saldo insuficiente')) {
          playSounds.error();
          toast.error("Saldo insuficiente para realizar esta aposta. Por favor, faça uma recarga.");
        } else {
          playSounds.error();
          toast.error("Erro ao registrar aposta. Tente novamente.");
        }
        setIsSubmitting(false);
        return;
      }

      playSounds.bet();
      toast.success("Aposta registrada com sucesso!");
      
      clearCombinations();
      // Transform the data to match our Bet type
      const transformedBet = {
        ...data,
        drawn_numbers: data.drawn_numbers as number[] | null,
      } as Bet;
      onBetPlaced(transformedBet);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erro ao registrar aposta:", error);
      playSounds.error();
      toast.error("Erro ao registrar aposta. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};