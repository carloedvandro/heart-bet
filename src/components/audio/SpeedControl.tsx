import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SpeedControlProps {
  playbackSpeed: string;
  onSpeedChange: (value: string) => void;
}

export const SpeedControl = ({ playbackSpeed, onSpeedChange }: SpeedControlProps) => {
  return (
    <Select value={playbackSpeed} onValueChange={onSpeedChange}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1x</SelectItem>
        <SelectItem value="2">2x</SelectItem>
        <SelectItem value="3">3x</SelectItem>
      </SelectContent>
    </Select>
  );
};