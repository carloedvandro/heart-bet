import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeOperation = (
  investmentId: string,
  amount: number,
  dailyRate: number,
  initialBalance: number
) => {
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const [nextOperationTime, setNextOperationTime] = useState<Date | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const fetchNextOperationTime = useCallback(async () => {
    if (isOperating || isCountingDown || operationCompleted) {
      console.log('Skipping fetchNextOperationTime - operation in progress or completed');
      return;
    }

    try {
      console.log('Fetching next operation time...');
      const { data, error } = await supabase
        .rpc('get_next_operation_time', { 
          p_investment_id: investmentId 
        });

      if (error) {
        console.error('Error fetching next operation time:', error);
        toast.error('Erro ao buscar próximo horário de operação');
        return;
      }

      if (data) {
        const nextTime = new Date(data);
        console.log('Next operation time received:', nextTime);
        
        if (!nextOperationTime || nextTime.getTime() !== nextOperationTime.getTime()) {
          setNextOperationTime(nextTime);
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching next operation time:', error);
      toast.error('Erro inesperado ao buscar próximo horário');
    }
  }, [investmentId, isOperating, isCountingDown, operationCompleted, nextOperationTime]);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout | null = null;

    const startFetching = async () => {
      if (!isOperating && !isCountingDown && !operationCompleted) {
        console.log('Initial fetch of operation time');
        await fetchNextOperationTime();

        if (isMounted) {
          interval = setInterval(async () => {
            if (!isOperating && !isCountingDown && !operationCompleted) {
              console.log('Periodic fetch of operation time');
              await fetchNextOperationTime();
            }
          }, 5000);
        }
      }
    };

    startFetching();

    return () => {
      console.log('Cleaning up fetch interval');
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchNextOperationTime, isOperating, isCountingDown, operationCompleted]);

  const handleOperationStart = async () => {
    if (isOperating || isCountingDown) {
      console.log('Operation already in progress');
      return;
    }

    console.log('Starting operation...');
    setIsOperating(true);
    setIsCountingDown(true);

    try {
      const now = new Date();
      const nextOperation = new Date(now.getTime() + 30 * 1000);

      console.log('Registering operation at:', now.toISOString());
      
      const { error: operationError } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investmentId,
          operated_at: now.toISOString(),
          next_operation_at: nextOperation.toISOString()
        });

      if (operationError) {
        console.error('Operation registration error:', operationError);
        toast.error('Erro ao registrar operação');
        setIsOperating(false);
        setIsCountingDown(false);
        return;
      }

      console.log('Operation registered successfully');
      console.log('Calling calculate_daily_earnings function...');
      
      const { data: earningsData, error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) {
        console.error('Earnings calculation error:', earningsError);
        toast.error('Erro ao calcular rendimentos');
        setIsOperating(false);
        setIsCountingDown(false);
        return;
      }

      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investmentId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated balance:', fetchError);
        toast.error('Erro ao atualizar saldo');
        setIsOperating(false);
        setIsCountingDown(false);
        return;
      }

      if (updatedInvestment) {
        const earned = updatedInvestment.current_balance - currentBalance;
        setCurrentBalance(updatedInvestment.current_balance);
        
        if (earned > 0) {
          toast.success(`Operação concluída! Rendimento: R$ ${earned.toFixed(2)}`);
        }
      }

      setNextOperationTime(nextOperation);
      
    } catch (error) {
      console.error('Operation error:', error);
      toast.error('Erro durante a operação');
      setIsOperating(false);
      setIsCountingDown(false);
    }
  };

  const handleOperationComplete = useCallback(() => {
    console.log('Operation completed');
    setIsOperating(false);
    setOperationCompleted(true);
    
    const timer = setTimeout(() => {
      console.log('Resetting operation states');
      setOperationCompleted(false);
      setIsCountingDown(false);
      fetchNextOperationTime();
    }, 5000);

    return () => {
      console.log('Cleaning up operation complete timer');
      clearTimeout(timer);
    };
  }, [fetchNextOperationTime]);

  return {
    isOperating,
    operationCompleted,
    currentBalance,
    nextOperationTime,
    handleOperationStart,
    handleOperationComplete
  };
};