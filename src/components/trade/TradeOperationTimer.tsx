import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

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
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ 
    minutes: 1, 
    seconds: 0 
  });
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      let targetTime: Date;

      if (operationCompleted) {
        // Se a operação foi completada, define o próximo horário alvo como 1 minuto a partir de agora
        targetTime = new Date(now.getTime() + 1 * 60 * 1000);
      } else {
        // Caso contrário, usa o tempo original de criação do investimento
        const created = new Date(investmentCreatedAt);
        targetTime = new Date(created.getTime() + 1 * 60 * 1000);
      }

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
  }, [investmentCreatedAt, isEnabled, operationCompleted]);

  // Reset canOperate quando a operação for completada
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