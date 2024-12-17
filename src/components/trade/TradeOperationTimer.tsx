import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInSeconds } from "date-fns";

interface TradeOperationTimerProps {
  investmentCreatedAt: string;
  onOperationStart: () => void;
  isEnabled: boolean;
  operationCompleted: boolean;
}

export function TradeOperationTimer({ 
  investmentCreatedAt, 
  onOperationStart,
  isEnabled,
  operationCompleted
}: TradeOperationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canOperate, setCanOperate] = useState(false);
  const [lastOperationTime, setLastOperationTime] = useState<Date>(new Date(investmentCreatedAt));

  useEffect(() => {
    if (!isEnabled) {
      setTimeLeft(60);
      setCanOperate(false);
      return;
    }

    // When operation is completed, update the last operation time
    if (operationCompleted) {
      setLastOperationTime(new Date());
      setTimeLeft(60);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = 60 - (secondsPassed % 60);

      if (secondsPassed >= 60) {
        setCanOperate(true);
        setTimeLeft(0);
      } else {
        setCanOperate(false);
        setTimeLeft(remaining);
      }
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(interval);
  }, [isEnabled, operationCompleted, lastOperationTime]);

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      {!canOperate ? (
        <div className="text-sm text-muted-foreground">
          Tempo restante para operar: {timeLeft}s
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