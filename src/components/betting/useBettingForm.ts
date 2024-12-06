import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { BetType, DrawPeriod, HEART_COLORS, MAX_SELECTIONS, Position } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";

export const useBettingForm = (onBetPlaced: (bet: Bet) => void) => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(1);
  const [position, setPosition] = useState<Position>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const session = useSession();
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

  const simulateReceiptButtonClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const receiptButtons = document.querySelectorAll('button:has(.lucide-receipt)') as NodeListOf<HTMLButtonElement>;
    if (receiptButtons.length > 0) {
      const lastReceiptButton = receiptButtons[0];
      lastReceiptButton.click();
    }
  };

  const handleHeartClick = (color: string) => {
    if (!session) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    setSelectedHearts((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      if (prev.length >= MAX_SELECTIONS[betType]) {
        playSounds.error();
        toast.error(`Máximo de ${MAX_SELECTIONS[betType]} ${betType === 'simple_group' ? 'coração' : 'corações'} para este tipo de aposta`);
        return prev;
      }
      return [...prev, color];
    });
  };

  const handleBetTypeChange = (newBetType: BetType) => {
    setBetType(newBetType);
    setSelectedHearts([]);
    toast.info(`Seleção de corações resetada para ${newBetType === 'simple_group' ? 'grupo simples' : 'nova aposta'}`);
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    if (selectedHearts.length !== MAX_SELECTIONS[betType]) {
      playSounds.error();
      toast.error(`Selecione exatamente ${MAX_SELECTIONS[betType]} ${betType === 'simple_group' ? 'coração' : 'corações'}`);
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

    const numbers = selectedHearts.map(color => 
      HEART_COLORS.find(h => h.color === color)?.number ?? 0
    );

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
      
      navigate("/dashboard?tab=bets");
      window.location.reload();
      
      setTimeout(() => {
        simulateReceiptButtonClick();
      }, 1500);

      setSelectedHearts([]);
      setBetAmount(1);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erro ao registrar aposta:", error);
      playSounds.error();
      toast.error("Erro ao registrar aposta. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return {
    selectedHearts,
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