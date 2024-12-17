import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addMinutes } from 'date-fns';

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

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
        throw error;
      }

      if (data) {
        const nextTime = new Date(data);
        console.log('Next operation time received:', nextTime);
        setNextOperationTime(nextTime);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error) {
      console.error('Error fetching next operation time:', error);
      
      if (retryCount < MAX_RETRIES) {
        // Increment retry count and try again after delay
        setRetryCount(prev => prev + 1);
        setTimeout(fetchNextOperationTime, RETRY_DELAY);
      } else {
        // After max retries, set a fallback next operation time
        const fallbackTime = addMinutes(new Date(), 1);
        console.log('Using fallback operation time:', fallbackTime);
        setNextOperationTime(fallbackTime);
        toast.error('Erro ao conectar com o servidor. Usando tempo estimado.');
      }
    }
  }, [investmentId, isOperating, isCountingDown, operationCompleted, retryCount]);

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
      const nextOperation = addMinutes(now, 1);

      console.log('Registering operation at:', now.toISOString());
      
      const { error: operationError } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investmentId,
          operated_at: now.toISOString(),
          next_operation_at: nextOperation.toISOString()
        });

      if (operationError) {
        throw operationError;
      }

      console.log('Operation registered successfully');
      console.log('Calling calculate_daily_earnings function...');
      
      const { error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) {
        throw earningsError;
      }

      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investmentId)
        .single();

      if (fetchError) {
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
      toast.error('Erro durante a operação. Tente novamente em alguns minutos.');
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

  return {
    isOperating,
    operationCompleted,
    currentBalance,
    nextOperationTime,
    handleOperationStart,
    handleOperationComplete
  };
};