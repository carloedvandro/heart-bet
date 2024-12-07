import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { BetType, DrawPeriod, Position } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";
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

    // Para grupo simples, criar as 4 dezenas combinando o coração principal com cada par
    const numbers = betType === "simple_group" 
      ? selectedHearts
          .filter(color => color !== mainHeart)
          .map(color => {
            const mainNumber = getNumberForHeart(mainHeart!);
            const pairNumber = getNumberForHeart(color);
            return mainNumber < pairNumber 
              ? mainNumber * 10 + pairNumber 
              : pairNumber * 10 + mainNumber;
          })
      : selectedHearts.map(color => getNumberForHeart(color));

    try {
      const { data: bet, error } = await supabase
        .from('bets')
        .insert({
          user_id: session.user.id,
          hearts: selectedHearts,
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
        setIsSubmitting(false);
        return;
      }

      playSounds.bet();
      toast.success("Aposta registrada com sucesso!");
      
      onBetPlaced(bet);
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