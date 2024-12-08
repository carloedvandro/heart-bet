import { Slider } from "@/components/ui/slider";

interface TimeControlProps {
  currentTime: number;
  duration: number;
  onTimeChange: (value: number[]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const TimeControl = ({
  currentTime,
  duration,
  onTimeChange,
  onDragStart,
  onDragEnd,
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
        max={duration || 100}
        min={0}
        step={0.1}
        onValueChange={onTimeChange}
        onPointerDown={onDragStart}
        onPointerUp={onDragEnd}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};