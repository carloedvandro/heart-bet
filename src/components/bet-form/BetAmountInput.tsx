import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { playSounds } from "@/utils/soundEffects";
import { BetType, Position, calculatePrize } from "@/types/betting";

interface BetAmountInputProps {
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  betType: BetType;
  position: Position;
}

export const BetAmountInput = ({ 
  betAmount, 
  onBetAmountChange,
  betType,
  position
}: BetAmountInputProps) => {
  const handleAmountChange = (value: number) => {
    onBetAmountChange(value);
    playSounds.coin();
  };

  const calculatePotentialPrize = () => {
    return calculatePrize(betType, position, betAmount);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Valor da Aposta (R$)</Label>
      <Input
        type="number"
        min="10"
        step="1"
        value={betAmount}
        onChange={(e) => handleAmountChange(Number(e.target.value))}
        className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink"
      />
      <p className="text-sm text-muted-foreground">
        Prêmio potencial: R$ {calculatePotentialPrize().toFixed(2)}
      </p>
    </div>
  );
};