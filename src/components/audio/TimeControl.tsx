import { Slider } from "@/components/ui/slider";

interface TimeControlProps {
  currentTime: number;
  duration: number;
  onTimeChange: (value: number[]) => void;
}

export const TimeControl = ({
  currentTime,
  duration,
  onTimeChange,
}: TimeControlProps) => {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-2">
      <Slider
        value={[currentTime]}
        max={duration}
        min={0}
        step={0.1}
        onValueChange={onTimeChange}
        className="w-full cursor-pointer"
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};