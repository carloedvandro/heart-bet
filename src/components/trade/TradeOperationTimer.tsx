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
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds countdown
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (!isEnabled || operationCompleted) {
      setTimeLeft(60);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const created = new Date(investmentCreatedAt);
      const secondsPassed = differenceInSeconds(now, created) % 60;
      const remaining = 60 - secondsPassed;

      if (remaining <= 0) {
        setCanOperate(true);
        setTimeLeft(0);
      } else {
        setCanOperate(false);
        setTimeLeft(remaining);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [investmentCreatedAt, isEnabled, operationCompleted]);

  // Reset canOperate when operation is completed
  useEffect(() => {
    if (operationCompleted) {
      setCanOperate(false);
    }
  }, [operationCompleted]);

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