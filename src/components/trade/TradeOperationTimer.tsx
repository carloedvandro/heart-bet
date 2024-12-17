import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface TradeOperationTimerProps {
  investmentCreatedAt: string;
  onOperationStart: () => void;
  isEnabled: boolean;
}

export function TradeOperationTimer({ 
  investmentCreatedAt, 
  onOperationStart,
  isEnabled 
}: TradeOperationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 24, 
    minutes: 0, 
    seconds: 0 
  });
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const created = new Date(investmentCreatedAt);
      const targetTime = new Date(created.getTime() + 24 * 60 * 60 * 1000); // 24 hours after creation

      if (now >= targetTime) {
        setCanOperate(true);
        return;
      }

      const hoursLeft = differenceInHours(targetTime, now);
      const minutesLeft = differenceInMinutes(targetTime, now) % 60;
      const secondsLeft = differenceInSeconds(targetTime, now) % 60;

      setTimeLeft({
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [investmentCreatedAt, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      {!canOperate ? (
        <div className="text-sm text-muted-foreground">
          Tempo restante para operar: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      ) : (
        <Button 
          onClick={onOperationStart}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          Operar Mercado
        </Button>
      )}
    </div>
  );
}