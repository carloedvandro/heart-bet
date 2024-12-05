import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import HeartButton from "./HeartButton";
import BetForm from "./BetForm";
import { BetType, DrawPeriod, HEART_COLORS, MAX_SELECTIONS, Position } from "@/types/betting";

const HeartGrid = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(1);
  const [position, setPosition] = useState<Position>(1);
  
  const session = useSession();

  // Shuffle the hearts array for display
  const shuffledHearts = [...HEART_COLORS]
    .sort(() => Math.random() - 0.5);

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

  const handleBetTypeChange = (newBetType: BetType) => {
    setBetType(newBetType);
    setSelectedHearts([]); // Reset selected hearts when bet type changes
    toast.info(`Seleção de corações resetada para ${newBetType === 'simple_group' ? 'grupo simples' : 'nova aposta'}`);
  };

  const handleSubmit = async () => {
    console.log("Current session:", session); // Debug log

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
      console.log("Attempting to place bet with user ID:", session.user.id); // Debug log

      const { error } = await supabase
        .from('bets')
        .insert({
          user_id: session.user.id,
          hearts: selectedHearts,
          numbers: numbers,
          bet_type: betType,
          draw_period: drawPeriod,
          amount: betAmount,
          position: position,
        });

      if (error) {
        console.error("Supabase error:", error); // Debug log
        if (error.message.includes('Saldo insuficiente')) {
          toast.error("Saldo insuficiente para realizar esta aposta");
        } else {
          throw error;
        }
        return;
      }

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
        setBetType={handleBetTypeChange}
        drawPeriod={drawPeriod}
        setDrawPeriod={setDrawPeriod}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        position={position}
        setPosition={setPosition}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
        {shuffledHearts.map(({ color }) => (
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