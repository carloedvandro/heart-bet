import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Position } from "@/types/betting";

interface PositionSelectProps {
  position: Position;
  onPositionChange: (position: Position) => void;
}

export const PositionSelect = ({ position, onPositionChange }: PositionSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Posição</Label>
      <Select 
        value={position.toString()} 
        onValueChange={(value) => onPositionChange(Number(value) as Position)}
      >
        <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Primeiro (Cabeça)</SelectItem>
          <SelectItem value="5">Do primeiro ao quinto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};