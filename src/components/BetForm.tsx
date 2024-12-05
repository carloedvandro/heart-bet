import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BetType, DrawPeriod, BET_MULTIPLIERS } from "@/types/betting";

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
  const getBetTypeName = (type: BetType): string => {
    const names: Record<BetType, string> = {
      simple_group: "Grupo Simples",
      dozen: "Dezena",
      hundred: "Centena",
      thousand: "Milhar",
      group_double: "Duque de Grupo",
      group_triple: "Terno de Grupo",
    };
    return names[type];
  };

  const getDrawPeriodName = (period: DrawPeriod): string => {
    const names: Record<DrawPeriod, string> = {
      morning: "Manhã (até 11h)",
      afternoon: "Tarde (até 15h)",
      evening: "Noite (até 19h)",
      night: "Corujinha (até 22h)",
    };
    return names[period];
  };

  const calculatePotentialPrize = (): number => {
    return betAmount * BET_MULTIPLIERS[betType];
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <Label>Tipo de Aposta</Label>
        <Select value={betType} onValueChange={(value) => setBetType(value as BetType)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de aposta" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(BET_MULTIPLIERS).map((type) => (
              <SelectItem key={type} value={type}>
                {getBetTypeName(type as BetType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Período do Sorteio</Label>
        <RadioGroup
          value={drawPeriod}
          onValueChange={(value) => setDrawPeriod(value as DrawPeriod)}
          className="grid grid-cols-2 gap-4"
        >
          {Object.entries({
            morning: "Manhã (até 11h)",
            afternoon: "Tarde (até 15h)",
            evening: "Noite (até 19h)",
            night: "Corujinha (até 22h)",
          }).map(([period, label]) => (
            <div key={period} className="flex items-center space-x-2">
              <RadioGroupItem value={period} id={period} />
              <Label htmlFor={period}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Valor da Aposta (R$)</Label>
        <Input
          type="number"
          min="1"
          step="1"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Prêmio potencial: R$ {calculatePotentialPrize().toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BetForm;