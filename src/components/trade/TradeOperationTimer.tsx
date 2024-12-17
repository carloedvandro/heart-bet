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
    if (!isEnabled) return;

    // Calculate initial time left based on nextOperationTime
    if (nextOperationTime) {
      const now = new Date();
      const diff = Math.max(0, Math.floor((nextOperationTime.getTime() - now.getTime()) / 1000));
      setTimeLeft(diff);
      setProgress(((30 - diff) / 30) * 100); // Using 30 seconds as total time
      setCanOperate(diff === 0);
    } else if (!operationCompleted) {
      // If no next operation time and not completed, start new timer
      setTimeLeft(30); // Set to 30 seconds
      setProgress(0);
      setCanOperate(false);
    }
  }, [isEnabled, nextOperationTime, operationCompleted]);

  useEffect(() => {
    if (!isEnabled || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) return null;
        if (current <= 0) {
          setCanOperate(true);
          return 0;
        }
        const newTimeLeft = current - 1;
        setProgress(((30 - newTimeLeft) / 30) * 100);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, timeLeft]);

  if (!isEnabled) return null;

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
      {canOperate && (
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