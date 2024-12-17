import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeOperation = (investmentId: string, amount: number, dailyRate: number, initialBalance: number) => {
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const [nextOperationTime, setNextOperationTime] = useState<Date | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Fetch next operation time from backend
  const fetchNextOperationTime = useCallback(async () => {
    // Se já estiver em contagem regressiva ou operando, não buscar novo tempo
    if (isCountingDown || isOperating) {
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_next_operation_time', { p_investment_id: investmentId });

      if (!error && data) {
        setNextOperationTime(new Date(data));
      }
    } catch (error) {
      console.error('Error fetching next operation time:', error);
    }
  }, [investmentId, isCountingDown, isOperating]);

  useEffect(() => {
    let isMounted = true;
    
    // Só configurar o intervalo se não estivermos em contagem regressiva ou operando
    if (!isCountingDown && !isOperating) {
      const fetchData = async () => {
        if (isMounted) {
          await fetchNextOperationTime();
        }
      };

      fetchData();
      
      const interval = setInterval(() => {
        if (isMounted && !isCountingDown && !isOperating) {
          fetchData();
        }
      }, 5000);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [fetchNextOperationTime, isCountingDown, isOperating]);

  const handleOperationStart = async () => {
    if (isOperating) return;

    console.log('=== Starting Trade Operation ===');
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
      
      const timer = setTimeout(() => {
        if (!isOperating) {
          setOperationCompleted(false);
          setIsCountingDown(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  };

  const handleOperationComplete = useCallback(() => {
    setIsOperating(false);
    setOperationCompleted(true);
    
    const timer = setTimeout(() => {
      setOperationCompleted(false);
      setIsCountingDown(false);
    }, 5000);

    return () => clearTimeout(timer);
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