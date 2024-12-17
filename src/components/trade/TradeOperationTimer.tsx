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
    if (!isEnabled || !nextOperationTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((nextOperationTime.getTime() - now.getTime()) / 1000));
      setTimeLeft(diff);
      setProgress(((30 - diff) / 30) * 100);
      setCanOperate(diff === 0);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, nextOperationTime]);

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