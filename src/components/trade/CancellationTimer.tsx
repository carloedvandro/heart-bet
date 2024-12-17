import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

interface CancellationTimerProps {
  createdAt: string;
  onTimeExpired: () => void;
  isActive: boolean; // New prop to control timer state
}

export function CancellationTimer({ createdAt, onTimeExpired, isActive }: CancellationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const CANCELLATION_WINDOW = 30; // 30 minutos

  useEffect(() => {
    // If not active, don't start the timer
    if (!isActive) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const minutesPassed = differenceInMinutes(now, created);
      const timeLeftMinutes = CANCELLATION_WINDOW - minutesPassed - 1;
      
      if (timeLeftMinutes < 0) {
        onTimeExpired();
        return;
      }

      const secondsPassed = differenceInSeconds(now, created) % 60;
      const timeLeftSeconds = 59 - secondsPassed;

      setTimeLeft({
        minutes: timeLeftMinutes,
        seconds: timeLeftSeconds
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onTimeExpired, isActive]);

  if (timeLeft.minutes < 0 || !isActive) return null;

  return (
    <div className="text-sm text-muted-foreground mt-2">
      Você tem{" "}
      <span className="font-medium text-primary">
        {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>{" "}
      minutos para cancelar esta transação
    </div>
  );
}