import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { BetType, DrawPeriod, Position } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";
import { useTemporaryBetState } from "./useTemporaryBetState";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

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

  const handleSubmit = async () => {
    if (!session?.user) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter corações em números para tipos específicos de aposta
      let numbers: string[];
      if (betType === 'dozen' || betType === 'hundred' || betType === 'thousand') {
        numbers = selectedHearts.map(heart => getNumberForHeart(heart).toString());
      } else {
        numbers = combinations.map(String);
      }

      const { data: bet, error } = await supabase
        .from('bets')
        .insert({
          user_id: session.user.id,
          numbers: numbers,
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
        return;
      }

      playSounds.bet();
      toast.success("Aposta registrada com sucesso!");
      
      clearCombinations();
      onBetPlaced(bet);
    } catch (error) {
      console.error("Erro ao registrar aposta:", error);
      playSounds.error();
      toast.error("Erro ao registrar aposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};