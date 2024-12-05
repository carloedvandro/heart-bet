import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import HeartButton from "./HeartButton";
import BetForm from "./BetForm";
import { BetType, DrawPeriod, HEART_COLORS, MAX_SELECTIONS } from "@/types/betting";

const HeartGrid = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(10);
  
  const session = useSession();

  const handleHeartClick = (color: string) => {
    setSelectedHearts((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      if (prev.length >= MAX_SELECTIONS[betType]) {
        toast.error(`Máximo de ${MAX_SELECTIONS[betType]} ${betType === 'simple_group' ? 'coração' : 'corações'} para este tipo de aposta`);
        return prev;
      }
      return [...prev, color];
    });
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer uma aposta");
      return;
    }

    if (selectedHearts.length !== MAX_SELECTIONS[betType]) {
      toast.error(`Selecione exatamente ${MAX_SELECTIONS[betType]} ${betType === 'simple_group' ? 'coração' : 'corações'}`);
      return;
    }

    const numbers = selectedHearts.map(color => 
      HEART_COLORS.find(h => h.color === color)?.number ?? 0
    );

    try {
      const { error } = await supabase
        .from('bets')
        .insert({
          user_id: session.user.id,
          hearts: selectedHearts,
          numbers: numbers,
          bet_type: betType,
          draw_period: drawPeriod,
          amount: betAmount,
        });

      if (error) throw error;

      toast.success("Aposta registrada com sucesso!");
      setSelectedHearts([]);
    } catch (error) {
      console.error("Erro ao registrar aposta:", error);
      toast.error("Erro ao registrar aposta. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <BetForm
        betType={betType}
        setBetType={setBetType}
        drawPeriod={drawPeriod}
        setDrawPeriod={setDrawPeriod}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
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
        disabled={selectedHearts.length !== MAX_SELECTIONS[betType]}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-heart-pink to-heart-purple
                 text-white rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-300 transform hover:scale-105
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar Aposta
      </button>
    </div>
  );
};

export default HeartGrid;