import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BetType } from "@/types/betting";
import { AudioPlayer } from "../audio/AudioPlayer";

interface BetTypeSelectProps {
  betType: BetType;
  onBetTypeChange: (type: BetType) => void;
}

export const BetTypeSelect = ({ betType, onBetTypeChange }: BetTypeSelectProps) => {
  const showAudioPlayer = betType === "simple_group";
  const audioUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/Regras_da_dezena.mp3";

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tipo de Aposta</Label>
      <Select value={betType} onValueChange={(value) => onBetTypeChange(value as BetType)}>
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

      <AudioPlayer 
        showPlayer={showAudioPlayer}
        audioUrl={audioUrl}
      />
    </div>
  );
};