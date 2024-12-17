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

  // Fetch next operation time from backend
  const fetchNextOperationTime = useCallback(async () => {
    // Não buscar novo tempo se estiver em operação ou contagem regressiva
    if (isOperating || isCountingDown) {
      console.log('Skipping fetchNextOperationTime - operation in progress');
      return;
    }

    try {
      console.log('Fetching next operation time...');
      const { data, error } = await supabase
        .rpc('get_next_operation_time', { p_investment_id: investmentId });

      if (!error && data) {
        console.log('Next operation time received:', new Date(data));
        setNextOperationTime(new Date(data));
      }
    } catch (error) {
      console.error('Error fetching next operation time:', error);
    }
  }, [investmentId, isOperating, isCountingDown]);

  // Efeito para buscar o próximo horário de operação
  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      if (isMounted && !isOperating && !isCountingDown) {
        await fetchNextOperationTime();
      }
    };

    // Iniciar busca apenas se não estiver em operação
    if (!isOperating && !isCountingDown) {
      console.log('Setting up fetch interval');
      fetchData();
      interval = setInterval(fetchData, 5000);
    }

    return () => {
      console.log('Cleaning up fetch interval');
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchNextOperationTime, isOperating, isCountingDown]);

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
        throw operationError;
      }

      console.log('Operation registered successfully');
      console.log('Calling calculate_daily_earnings function...');
      
      const { data: earningsData, error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) {
        console.error('Earnings calculation error:', earningsError);
        throw earningsError;
      }

      // Fetch updated investment data
      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investmentId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated balance:', fetchError);
        throw fetchError;
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
    } finally {
      setIsOperating(false);
      setOperationCompleted(true);
    }
  };

  const handleOperationComplete = useCallback(() => {
    console.log('Operation completed');
    setIsOperating(false);
    setOperationCompleted(true);
    
    // Aguardar 5 segundos antes de resetar os estados
    const timer = setTimeout(() => {
      console.log('Resetting operation states');
      setOperationCompleted(false);
      setIsCountingDown(false);
    }, 5000);

    return () => {
      console.log('Cleaning up operation complete timer');
      clearTimeout(timer);
    };
  }, []);

  return {
    isOperating,
    operationCompleted,
    currentBalance,
    nextOperationTime,
    handleOperationStart,
    handleOperationComplete
  };
};