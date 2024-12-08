import { useState } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetType, DrawPeriod, Position } from "@/types/betting";
import BetForm from "./BetForm";
import BettingHeartGrid from "./BettingHeartGrid";
import { Button } from "../ui/button";
import { Eraser } from "lucide-react";
import { toast } from "sonner";
import ListenRulesButton from "../audio/ListenRulesButton";

interface BettingFormProps {
  onBetPlaced: (bet: Bet) => void;
  initialBetType?: BetType;
}

const BettingForm = ({ onBetPlaced, initialBetType = "simple_group" }: BettingFormProps) => {
  const [betType, setBetType] = useState<BetType>(initialBetType);
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(10);
  const [position, setPosition] = useState<Position>(1);

  const getAudioUrl = (betType: BetType) => {
    switch (betType) {
      case "simple_group":
        return "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Regras_do_grupo_simples.mp3";
      case "dozen":
        return "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Regras_da_dezena.mp3";
      case "hundred":
        return "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Regras_da_sentena.mp3";
      default:
        return "";
    }
  };

  const handleClearSelection = () => {
    setBetType("simple_group");
    setDrawPeriod("morning");
    setBetAmount(10);
    setPosition(1);
    toast.success("Seleção limpa com sucesso!");
  };

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <ListenRulesButton audioUrl={getAudioUrl(betType)} />
      </div>

      <BetForm
        betType={betType}
        setBetType={setBetType}
        drawPeriod={drawPeriod}
        setDrawPeriod={setDrawPeriod}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        position={position}
        setPosition={setPosition}
      />

      <BettingHeartGrid
        betType={betType}
        drawPeriod={drawPeriod}
        betAmount={betAmount}
        position={position}
      />

      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSelection}
          className="gap-2"
        >
          <Eraser className="h-4 w-4" />
          Limpar Seleção
        </Button>
      </div>
    </>
  );
};

export default BettingForm;