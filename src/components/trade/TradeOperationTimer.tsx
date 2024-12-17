import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { OperationProgress } from "./OperationProgress";
import { PlayCircle } from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [canOperate, setCanOperate] = useState(false);

  useEffect(() => {
    if (operationCompleted) {
      setTimeLeft(60); // Reset to 60 seconds after operation completes
      setProgress(0);
      setCanOperate(false);
    }
  }, [operationCompleted]);

  useEffect(() => {
    if (!isEnabled || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) return null;
        if (current <= 0) {
          setCanOperate(true);
          return 0;
        }
        setProgress(((60 - current) / 60) * 100);
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, timeLeft]);

  useEffect(() => {
    if (isEnabled && !operationCompleted) {
      setTimeLeft(60);
      setCanOperate(false);
    }
  }, [isEnabled, operationCompleted]);

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