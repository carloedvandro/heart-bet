import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { BetType, DrawPeriod, HEART_COLORS, MAX_SELECTIONS, Position } from "@/types/betting";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

export const useBettingForm = (onBetPlaced: (bet: Bet) => void) => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [mainHeart, setMainHeart] = useState<string | null>(null);
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

  const handleHeartClick = (color: string) => {
    if (!session) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    if (betType === "simple_group") {
      // Se ainda não temos um coração principal
      if (!mainHeart) {
        setMainHeart(color);
        setSelectedHearts([color]);
        toast.info("Agora escolha 4 corações diferentes para formar os pares");
        return;
      }

      // Se já temos o coração principal
      if (color === mainHeart) {
        playSounds.error();
        toast.error("Escolha um coração diferente do principal para formar o par");
        return;
      }

      setSelectedHearts((prev) => {
        // Se o coração já foi selecionado como par
        if (prev.includes(color)) {
          return prev.filter((c) => c !== color);
        }

        // Contando quantos pares já foram formados (excluindo o coração principal)
        const pairsCount = prev.filter(c => c !== mainHeart).length;

        if (pairsCount >= 4) {
          playSounds.error();
          toast.error("Você já selecionou todos os pares necessários");
          return prev;
        }

        return [...prev, color];
      });
    } else {
      // Lógica original para outros tipos de aposta
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
    }
  };

  const handleBetTypeChange = (newBetType: BetType) => {
    setBetType(newBetType);
    setSelectedHearts([]);
    setMainHeart(null);
    toast.info(`Seleção de corações resetada para ${newBetType === 'simple_group' ? 'grupo simples' : 'nova aposta'}`);
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      playSounds.error();
      toast.error("Você precisa estar logado para fazer uma aposta");
      navigate("/login");
      return;
    }

    if (betType === "simple_group") {
      // Verificar se temos o coração principal e 4 pares
      const pairsCount = selectedHearts.filter(c => c !== mainHeart).length;
      if (!mainHeart || pairsCount !== 4) {
        playSounds.error();
        toast.error("Para grupo simples, você precisa selecionar um coração principal e 4 corações diferentes para formar pares");
        return;
      }
    } else if (selectedHearts.length !== MAX_SELECTIONS[betType]) {
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

      setSelectedHearts([]);
      setMainHeart(null);
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