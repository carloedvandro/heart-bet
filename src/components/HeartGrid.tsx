import { useState } from "react";
import HeartButton from "./HeartButton";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const HEART_COLORS = [
  { color: "pink", number: 0 },
  { color: "red", number: 1 },
  { color: "orange", number: 2 },
  { color: "yellow", number: 3 },
  { color: "green", number: 4 },
  { color: "blue", number: 5 },
  { color: "purple", number: 6 },
  { color: "coral", number: 7 },
  { color: "indigo", number: 8 },
  { color: "crimson", number: 9 },
];

type BetType = 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple';
type DrawPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

const MAX_SELECTIONS: Record<BetType, number> = {
  simple_group: 1,
  dozen: 2,
  hundred: 3,
  thousand: 4,
  group_double: 2,
  group_triple: 3,
};

const PERIOD_LIMITS: Record<DrawPeriod, string> = {
  morning: "11:00",
  afternoon: "15:00",
  evening: "19:00",
  night: "22:00",
};

const BET_MULTIPLIERS: Record<BetType, number> = {
  simple_group: 9,
  dozen: 30,
  hundred: 300,
  thousand: 2000,
  group_double: 150,
  group_triple: 250,
};

const HeartGrid = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleHeartClick = (color: string) => {
    setSelectedHearts((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      if (prev.length >= MAX_SELECTIONS[betType]) {
        toast.error(`Máximo de ${MAX_SELECTIONS[betType]} ${betType === 'simple_group' ? 'coração' : 'corações'} para ${getBetTypeName(betType)}`);
        return prev;
      }
      return [...prev, color];
    });
  };

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

  const handleSubmit = async () => {
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
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <Label>Tipo de Aposta</Label>
          <Select value={betType} onValueChange={(value) => {
            setBetType(value as BetType);
            setSelectedHearts([]);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de aposta" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(MAX_SELECTIONS).map((type) => (
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
            {Object.entries(PERIOD_LIMITS).map(([period, limit]) => (
              <div key={period} className="flex items-center space-x-2">
                <RadioGroupItem value={period} id={period} />
                <Label htmlFor={period}>{getDrawPeriodName(period as DrawPeriod)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Valor da Aposta (R$)</Label>
          <input
            type="number"
            min="10"
            step="10"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-sm text-muted-foreground">
            Prêmio potencial: R$ {calculatePotentialPrize().toFixed(2)}
          </p>
        </div>
      </div>

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