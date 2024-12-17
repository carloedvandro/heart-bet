import { BetType, DrawPeriod, Position } from "@/types/betting";
import { BetTypeSelect } from "../bet-form/BetTypeSelect";
import { PositionSelect } from "../bet-form/PositionSelect";
import { DrawPeriodSelect } from "../bet-form/DrawPeriodSelect";
import { BetAmountInput } from "../bet-form/BetAmountInput";

interface BetFormProps {
  betType: BetType;
  setBetType: (type: BetType) => void;
  drawPeriod: DrawPeriod;
  setDrawPeriod: (period: DrawPeriod) => void;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  position: Position;
  setPosition: (position: Position) => void;
}

const BetForm = ({
  betType,
  setBetType,
  drawPeriod,
  setDrawPeriod,
  betAmount,
  setBetAmount,
  position,
  setPosition,
}: BetFormProps) => {
  return (
    <div className="w-full max-w-md space-y-6">
      <BetTypeSelect 
        betType={betType} 
        onBetTypeChange={setBetType} 
      />
      
      <PositionSelect 
        position={position} 
        onPositionChange={setPosition} 
      />
      
      <DrawPeriodSelect 
        drawPeriod={drawPeriod} 
        onDrawPeriodChange={setDrawPeriod} 
      />
      
      <BetAmountInput 
        betAmount={betAmount} 
        onBetAmountChange={setBetAmount}
        betType={betType}
        position={position}
      />
    </div>
  );
};

export default BetForm;