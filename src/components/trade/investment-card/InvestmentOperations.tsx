import { Button } from "@/components/ui/button";
import { CancellationTimer } from "../CancellationTimer";
import { TradeOperationTimer } from "../TradeOperationTimer";
import { TradeOperationMessages } from "../TradeOperationMessages";

interface InvestmentOperationsProps {
  canCancel: boolean;
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
  createdAt,
  status,
  isProcessing,
  onCancelInvestment,
  onOperationStart,
  onOperationComplete,
  isOperating,
  operationCompleted
}: InvestmentOperationsProps) {
  if (canCancel) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full md:w-auto"
          onClick={onCancelInvestment}
          disabled={isProcessing || status !== 'active'}
        >
          {isProcessing ? "Cancelando..." : "Cancelar Investimento"}
        </Button>
        <CancellationTimer 
          createdAt={createdAt}
          onTimeExpired={() => {}}
          isActive={status === 'active'}
        />
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <p className="text-sm text-red-500">
        Investimento cancelado em {new Date().toLocaleDateString()}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <TradeOperationTimer
        investmentId={status}
        onOperationStart={onOperationStart}
        isEnabled={!canCancel && status === 'active' && !isOperating}
        operationCompleted={operationCompleted}
      />
      <TradeOperationMessages
        isOperating={isOperating}
        onOperationComplete={onOperationComplete}
      />
    </div>
  );
}