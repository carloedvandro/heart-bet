import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DrawPeriod, DRAW_PERIODS } from "@/types/betting";

interface DrawPeriodSelectProps {
  drawPeriod: DrawPeriod;
  onDrawPeriodChange: (period: DrawPeriod) => void;
}

export const DrawPeriodSelect = ({ drawPeriod, onDrawPeriodChange }: DrawPeriodSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Período do Sorteio</Label>
      <RadioGroup
        value={drawPeriod}
        onValueChange={(value) => onDrawPeriodChange(value as DrawPeriod)}
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
  );
};