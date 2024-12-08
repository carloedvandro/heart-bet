import { Slider } from "@/components/ui/slider";

interface TimeSliderProps {
  currentTime: number;
  duration: number;
  isLoading: boolean;
  onTimeChange: (newValue: number[]) => void;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const TimeSlider = ({ currentTime, duration, isLoading, onTimeChange }: TimeSliderProps) => {
  return (
    <div className="space-y-1">
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.1}
        onValueChange={onTimeChange}
        disabled={isLoading}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default TimeSlider;