import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addMinutes } from 'date-fns';

export const useTradeOperation = (
  investmentId: string,
  amount: number,
  dailyRate: number,
  initialBalance: number
) => {
  // Refs for managing component lifecycle
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const MAX_RETRIES = 3;

  // State declarations - all at the top level
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const [nextOperationTime, setNextOperationTime] = useState<Date | null>(null);

  // Safe state updates
  const safeSetState = useCallback(<T>(setter: (value: T) => void, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  const fetchNextOperationTime = useCallback(async () => {
    if (!isMountedRef.current || isOperating || operationCompleted) {
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_next_operation_time', { 
          p_investment_id: investmentId 
        });

      if (!isMountedRef.current) return;

      if (error) {
        console.error('Error fetching next operation time:', error);
        throw error;
      }

      if (data) {
        safeSetState(setNextOperationTime, new Date(data));
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Error in fetchNextOperationTime:', error);
      
      if (retryCountRef.current < MAX_RETRIES && isMountedRef.current) {
        retryCountRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 5000);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchNextOperationTime();
          }
        }, delay);
      } else if (isMountedRef.current) {
        const fallbackTime = addMinutes(new Date(), 1);
        safeSetState(setNextOperationTime, fallbackTime);
        toast.error('Erro ao conectar com o servidor. Usando tempo estimado.');
      }
    }
  }, [investmentId, isOperating, operationCompleted, safeSetState]);

  const handleOperationStart = async () => {
    if (!isMountedRef.current || isOperating) {
      return;
    }

    safeSetState(setIsOperating, true);

    try {
      const now = new Date();
      const nextOperation = addMinutes(now, 1);
      
      const { error: operationError } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investmentId,
          operated_at: now.toISOString(),
          next_operation_at: nextOperation.toISOString()
        });

      if (operationError) throw operationError;

      const { error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) throw earningsError;

      if (!isMountedRef.current) return;

      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance')
        .eq('id', investmentId)
        .single();

      if (fetchError) throw fetchError;

      if (updatedInvestment && isMountedRef.current) {
        const earned = updatedInvestment.current_balance - currentBalance;
        safeSetState(setCurrentBalance, updatedInvestment.current_balance);
        
        if (earned > 0) {
          toast.success(`Operação concluída! Rendimento: R$ ${earned.toFixed(2)}`);
        }
      }

      if (isMountedRef.current) {
        safeSetState(setNextOperationTime, nextOperation);
      }
    } catch (error) {
      console.error('Operation error:', error);
      toast.error('Erro durante a operação. Tente novamente em alguns minutos.');
      
      if (isMountedRef.current) {
        safeSetState(setIsOperating, false);
      }
    }
  };

  const handleOperationComplete = useCallback(() => {
    if (!isMountedRef.current) return;
    
    safeSetState(setIsOperating, false);
    safeSetState(setOperationCompleted, true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        safeSetState(setOperationCompleted, false);
        fetchNextOperationTime();
      }
    }, 5000);
  }, [fetchNextOperationTime, safeSetState]);

  useEffect(() => {
    isMountedRef.current = true;

    const setupInterval = () => {
      if (!isOperating && !operationCompleted) {
        fetchNextOperationTime();
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
          if (isMountedRef.current && !isOperating && !operationCompleted) {
            fetchNextOperationTime();
          }
        }, 5000);
      }
    };

    setupInterval();

    return () => {
      isMountedRef.current = false;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNextOperationTime, isOperating, operationCompleted]);

  return {
    isOperating,
    operationCompleted,
    currentBalance,
    nextOperationTime,
    handleOperationStart,
    handleOperationComplete
  };
};