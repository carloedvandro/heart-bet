import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMinutes } from "date-fns";
import { CancellationTimer } from "./CancellationTimer";
import { TradeOperationTimer } from "./TradeOperationTimer";
import { TradeOperationMessages } from "./TradeOperationMessages";
import { useState, memo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(investment.current_balance);

  const handleTimeExpired = () => {
    setCanCancel(false);
  };

  const handleOperationStart = async () => {
    setIsOperating(true);
    try {
      const now = new Date();
      const nextOperation = new Date(now.getTime() + 60 * 1000); // 1 minute for testing

      const { error } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investment.id,
          operated_at: now.toISOString(),
          next_operation_at: nextOperation.toISOString()
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error starting operation:', error);
      toast.error('Erro ao iniciar operação');
      setIsOperating(false);
    }
  };

  const handleOperationComplete = async () => {
    setIsOperating(false);
    setOperationCompleted(true);
    
    try {
      // Calcular o ganho baseado na taxa diária
      const earningAmount = investment.amount * (investment.daily_rate / 100);

      // Inserir o ganho na tabela trade_earnings
      const { error: earningsError } = await supabase
        .from('trade_earnings')
        .insert({
          investment_id: investment.id,
          amount: earningAmount
        });

      if (earningsError) throw earningsError;

      // Atualizar o saldo atual do investimento
      const { data, error: balanceError } = await supabase
        .from('trade_investments')
        .select('current_balance')
        .eq('id', investment.id)
        .single();

      if (balanceError) throw balanceError;
      
      if (data) {
        setCurrentBalance(data.current_balance);
      }

      // Resetar operationCompleted após 1 minuto
      setTimeout(() => {
        setOperationCompleted(false);
      }, 60000);

    } catch (error) {
      console.error('Error completing operation:', error);
      toast.error('Erro ao completar operação');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Investido em: {new Date(investment.created_at).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              R$ {Number(investment.amount).toFixed(2)}
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
            <p className="font-semibold">
              Saldo atual: R$ {Number(currentBalance).toFixed(2)}
            </p>
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
                  investmentCreatedAt={investment.created_at}
                  onOperationStart={handleOperationStart}
                  isEnabled={!canCancel && investment.status === 'active' && !isOperating}
                  operationCompleted={operationCompleted}
                />
                <TradeOperationMessages
                  isOperating={isOperating}
                  onOperationComplete={handleOperationComplete}
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