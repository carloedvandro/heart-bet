import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

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
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ 
    minutes: 1, 
    seconds: 0 
  });
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const created = new Date(investmentCreatedAt);
      const targetTime = new Date(created.getTime() + 1 * 60 * 1000); // 1 minute after creation

      if (now >= targetTime) {
        setCanOperate(true);
        return;
      }

      const minutesLeft = differenceInMinutes(targetTime, now);
      const secondsLeft = differenceInSeconds(targetTime, now) % 60;

      setTimeLeft({
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
          Tempo restante para operar: {timeLeft.minutes}m {timeLeft.seconds}s
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