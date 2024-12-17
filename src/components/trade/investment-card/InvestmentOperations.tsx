import { Button } from "@/components/ui/button";
import { TradeOperationTimer } from "../TradeOperationTimer";

interface InvestmentOperationsProps {
  canCancel: boolean;
  timeLeft: string | null;
  createdAt: string;
  status: string;
  isProcessing: boolean;
  onCancelInvestment: () => void;
  onOperationStart: () => void;
  onOperationComplete: () => void;
  isOperating: boolean;
  operationCompleted: boolean;
}

export function InvestmentOperations({
  canCancel,
  timeLeft,
  status,
  isProcessing,
  onCancelInvestment,
  onOperationStart,
  onOperationComplete,
  isOperating,
  operationCompleted
}: InvestmentOperationsProps) {
  return (
    <div className="flex flex-col gap-2">
      {canCancel && status === 'active' && (
        <div className="flex flex-col gap-1">
          <Button 
            variant="destructive" 
            size="sm"
            className="w-full md:w-auto"
            onClick={onCancelInvestment}
            disabled={isProcessing}
          >
            {isProcessing ? "Cancelando..." : "Cancelar Investimento"}
          </Button>
          {timeLeft && (
            <span className="text-sm text-muted-foreground text-center md:text-right">
              Tempo restante para cancelar: {timeLeft}
            </span>
          )}
        </div>
      )}

      {!canCancel && status === 'active' && (
        <TradeOperationTimer
          investmentId={status}
          onOperationStart={onOperationStart}
          isEnabled={true}
          operationCompleted={operationCompleted}
        />
      )}
    </div>
  );
}