import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BetType, DrawPeriod, BET_MULTIPLIERS, DRAW_PERIODS } from "@/types/betting";

interface BetFormProps {
  betType: BetType;
  setBetType: (type: BetType) => void;
  drawPeriod: DrawPeriod;
  setDrawPeriod: (period: DrawPeriod) => void;
  betAmount: number;
  setBetAmount: (amount: number) => void;
}

const BetForm = ({
  betType,
  setBetType,
  drawPeriod,
  setDrawPeriod,
  betAmount,
  setBetAmount,
}: BetFormProps) => {
  const calculatePotentialPrize = () => {
    return betAmount * BET_MULTIPLIERS[betType];
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Aposta</Label>
        <Select value={betType} onValueChange={(value) => setBetType(value as BetType)}>
          <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple_group">Grupo Simples</SelectItem>
            <SelectItem value="dozen">Dezena</SelectItem>
            <SelectItem value="hundred">Centena</SelectItem>
            <SelectItem value="thousand">Milhar</SelectItem>
            <SelectItem value="group_double">Duque de Grupo</SelectItem>
            <SelectItem value="group_triple">Terno de Grupo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Período do Sorteio</Label>
        <RadioGroup
          value={drawPeriod}
          onValueChange={(value) => setDrawPeriod(value as DrawPeriod)}
          className="grid grid-cols-2 gap-4"
        >
          {Object.entries(DRAW_PERIODS).map(([period, label]) => (
            <div key={period} className="flex items-center space-x-2">
              <RadioGroupItem value={period} id={period} />
              <Label htmlFor={period}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Valor da Aposta (R$)</Label>
        <Input
          type="number"
          min="1"
          step="1"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink"
        />
        <p className="text-sm text-muted-foreground">
          Prêmio potencial: R$ {calculatePotentialPrize().toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BetForm;