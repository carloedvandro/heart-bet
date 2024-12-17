import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { OperationProgress } from "./OperationProgress";
import { PlayCircle } from "lucide-react";

interface TradeOperationTimerProps {
  investmentCreatedAt: string;
  onOperationStart: () => void;
  isEnabled: boolean;
  operationCompleted: boolean;
  nextOperationTime?: Date | null;
}

export function TradeOperationTimer({
  investmentCreatedAt,
  onOperationStart,
  isEnabled,
  operationCompleted,
  nextOperationTime
}: TradeOperationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (!isEnabled || !nextOperationTime) {
      console.log('Timer disabled or no next operation time');
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const nextTime = new Date(nextOperationTime);
      const diffMs = nextTime.getTime() - now.getTime();
      const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
      
      console.log('Timer update:', {
        now: now.toISOString(),
        nextTime: nextTime.toISOString(),
        diffSeconds,
        isEnabled,
        operationCompleted
      });
      
      setTimeLeft(diffSeconds);
      setProgress(Math.min(100, ((30 - diffSeconds) / 30) * 100));
      setCanOperate(diffSeconds === 0);
    };

    // Calcular imediatamente
    calculateTimeLeft();

    // Atualizar a cada segundo
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    console.log('Timer started');

    return () => {
      console.log('Timer cleanup');
      clearInterval(timer);
    };
  }, [isEnabled, nextOperationTime, operationCompleted]);

  useEffect(() => {
    console.log('Timer state:', {
      timeLeft,
      progress,
      canOperate,
      isEnabled,
      operationCompleted
    });
  }, [timeLeft, progress, canOperate, isEnabled, operationCompleted]);

  if (!isEnabled) {
    console.log('Timer component disabled');
    return null;
  }

  return (
    <div className="w-full space-y-2">
      {timeLeft !== null && timeLeft > 0 && (
        <>
          <div className="text-sm text-gray-500">
            Próxima operação em: {timeLeft}s
          </div>
          <OperationProgress value={progress} />
        </>
      )}
      {canOperate && !operationCompleted && (
        <Button
          onClick={onOperationStart}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          Operar
        </Button>
      )}
    </div>
  );
}