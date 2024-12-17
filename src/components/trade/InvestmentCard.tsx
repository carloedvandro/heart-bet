import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMinutes } from "date-fns";
import { CancellationTimer } from "./CancellationTimer";
import { TradeOperationTimer } from "./TradeOperationTimer";
import { TradeOperationMessages } from "./TradeOperationMessages";
import { useState, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OperationProgress } from "./OperationProgress";

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
      console.log('=== Iniciando operação ===');
      console.log('ID do investimento:', investment.id);
      console.log('Valor investido:', investment.amount);
      console.log('Taxa diária:', investment.daily_rate);
      console.log('Saldo atual:', currentBalance);
      
      const now = new Date();
      const nextOperation = new Date(now.getTime() + 60 * 1000); // 1 minuto para teste

      // Registrar a operação
      const { error: operationError } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investment.id,
          operated_at: now.toISOString(),
          next_operation_at: nextOperation.toISOString()
        });

      if (operationError) {
        console.error('Erro ao registrar operação:', operationError);
        throw operationError;
      }

      console.log('Operação registrada com sucesso');

      // Chamar a função de cálculo de rendimentos
      const { data: earningsData, error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) {
        console.error('Erro ao calcular rendimentos:', earningsError);
        throw earningsError;
      }

      console.log('Função calculate_daily_earnings executada:', earningsData);

      // Buscar o investimento atualizado
      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investment.id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar saldo atualizado:', fetchError);
        throw fetchError;
      }

      if (updatedInvestment) {
        console.log('=== Resultado da operação ===');
        console.log('Saldo anterior:', currentBalance);
        console.log('Novo saldo:', updatedInvestment.current_balance);
        
        const earned = updatedInvestment.current_balance - currentBalance;
        console.log('Rendimento calculado:', earned);
        
        setCurrentBalance(updatedInvestment.current_balance);
        
        if (earned > 0) {
          toast.success(`Operação concluída! Rendimento: R$ ${earned.toFixed(2)}`);
        } else {
          console.warn('Nenhum rendimento registrado nesta operação');
          toast.info('Operação concluída, mas não houve rendimento neste período.');
        }
      }

    } catch (error) {
      console.error('Erro durante a operação:', error);
      toast.error('Erro ao realizar operação');
      setIsOperating(false);
    }
  };

  const handleOperationComplete = async () => {
    setIsOperating(false);
    setOperationCompleted(true);
    
    try {
      const { data, error } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investment.id)
        .single();

      if (error) throw error;
      
      if (data) {
        const earned = data.current_balance - currentBalance;
        setCurrentBalance(data.current_balance);
        
        if (earned > 0) {
          toast.success(`Rendimentos calculados: R$ ${earned.toFixed(2)}`);
        }
      }

      setTimeout(() => {
        setOperationCompleted(false);
      }, 60000);

    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      toast.error('Erro ao atualizar saldo');
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
                {isOperating && <OperationProgress />}
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