import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMinutes } from "date-fns";
import { CancellationTimer } from "./CancellationTimer";
import { TradeOperationTimer } from "./TradeOperationTimer";
import { TradeOperationMessages } from "./TradeOperationMessages";
import { useState, memo } from "react";
import { useTradeOperation } from "./hooks/useTradeOperation";

interface Investment {
  id: string;
  created_at: string;
  amount: number;
  daily_rate: number;
  locked_until: string;
  current_balance: number;
  status: string;
}

interface InvestmentCardProps {
  investment: Investment;
  onCancelInvestment: (id: string, createdAt: string) => void;
  isProcessing: boolean;
}

const InvestmentCard = memo(({ 
  investment, 
  onCancelInvestment, 
  isProcessing 
}: InvestmentCardProps) => {
  const [canCancel, setCanCancel] = useState(
    differenceInMinutes(new Date(), new Date(investment.created_at)) <= 30 && 
    investment.status === 'active'
  );

  const {
    isOperating,
    operationCompleted,
    handleOperationStart,
    handleOperationComplete
  } = useTradeOperation({ investmentId: investment.id });

  const handleTimeExpired = () => {
    setCanCancel(false);
  };

  // Calcula o total de rendimentos (diferença entre o saldo atual e o valor inicial)
  const totalEarnings = investment.current_balance - investment.amount;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Investido em: {new Date(investment.created_at).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              Valor inicial: R$ {Number(investment.amount).toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              Rendimento: {investment.daily_rate}% ao dia
            </p>
            {investment.status === 'cancelled' && (
              <p className="text-sm text-red-500">
                Investimento Cancelado
              </p>
            )}
          </div>
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-500">
              Bloqueado até: {new Date(investment.locked_until).toLocaleDateString()}
            </p>
            <div className="space-y-1">
              <p className="font-semibold">
                Valor atual: R$ {Number(investment.current_balance).toFixed(2)}
              </p>
              <p className="text-sm text-green-600">
                Rendimentos: + R$ {totalEarnings.toFixed(2)}
              </p>
            </div>
            {canCancel ? (
              <div className="flex flex-col items-end gap-1">
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => onCancelInvestment(investment.id, investment.created_at)}
                  disabled={isProcessing || investment.status !== 'active'}
                >
                  {isProcessing ? "Cancelando..." : "Cancelar Investimento"}
                </Button>
                <CancellationTimer 
                  createdAt={investment.created_at}
                  onTimeExpired={handleTimeExpired}
                  isActive={investment.status === 'active'}
                />
              </div>
            ) : investment.status === 'cancelled' ? (
              <p className="text-sm text-red-500">
                Investimento cancelado em {new Date().toLocaleDateString()}
              </p>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <TradeOperationTimer
                  investmentId={investment.id}
                  onOperationStart={handleOperationStart}
                  isEnabled={!canCancel && investment.status === 'active' && !isOperating}
                  operationCompleted={operationCompleted}
                />
                <TradeOperationMessages
                  isOperating={isOperating}
                  onOperationComplete={handleOperationComplete}
                  investmentAmount={investment.amount}
                  dailyRate={investment.daily_rate}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

InvestmentCard.displayName = 'InvestmentCard';

export { InvestmentCard };