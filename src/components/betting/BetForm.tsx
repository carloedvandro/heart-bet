import React from 'react';
import { BetType, DrawPeriod, Position } from "@/types/betting";
import { BetTypeSelect } from '../bet-form/BetTypeSelect';
import { DrawPeriodSelect } from '../bet-form/DrawPeriodSelect';
import { PositionSelect } from '../bet-form/PositionSelect';
import { BetAmountInput } from '../bet-form/BetAmountInput';

interface BetFormProps {
  betType: BetType;
  setBetType: (betType: BetType) => void;
  drawPeriod: DrawPeriod;
  setDrawPeriod: (drawPeriod: DrawPeriod) => void;
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
  setPosition 
}: BetFormProps) => {
  return (
    <div className="w-full max-w-md space-y-6 bg-white/70 p-6 rounded-lg shadow-md">
      <BetTypeSelect 
        betType={betType} 
        onBetTypeChange={setBetType} 
      />
      
      <DrawPeriodSelect 
        drawPeriod={drawPeriod} 
        onDrawPeriodChange={setDrawPeriod} 
      />
      
      <PositionSelect 
        position={position} 
        onPositionChange={setPosition} 
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