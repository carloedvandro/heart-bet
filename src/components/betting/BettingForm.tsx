import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import HeartButton from "../HeartButton";
import BetForm from "../BetForm";
import { BetType, DrawPeriod, HEART_COLORS, MAX_SELECTIONS, Position } from "@/types/betting";
import { useNavigate } from "react-router-dom";
import { playSounds } from "@/utils/soundEffects";
import { Bet } from "@/integrations/supabase/custom-types";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
}

const BettingForm = ({ onBetPlaced }: BettingFormProps) => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(1);
  const [position, setPosition] = useState<Position>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const session = useSession();
  const navigate = useNavigate();

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
      onBetPlaced(bet);
    } catch (error) {
      console.error("Erro ao registrar aposta:", error);
      playSounds.error();
      toast.error("Erro ao registrar aposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BetForm
        betType={betType}
        setBetType={handleBetTypeChange}
        drawPeriod={drawPeriod}
        setDrawPeriod={setDrawPeriod}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        position={position}
        setPosition={setPosition}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
        {HEART_COLORS.map(({ color }) => (
          <HeartButton
            key={color}
            color={color}
            selected={selectedHearts.includes(color)}
            onClick={() => handleHeartClick(color)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!session || selectedHearts.length !== MAX_SELECTIONS[betType] || isSubmitting}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-heart-pink to-heart-purple
                 text-white rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-300 transform hover:scale-105
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processando..." : session ? "Confirmar Aposta" : "Faça login para apostar"}
      </button>
    </>
  );
};

export default BettingForm;