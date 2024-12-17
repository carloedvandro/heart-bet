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
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const [nextOperationTime, setNextOperationTime] = useState<Date | null>(null);

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
        setNextOperationTime(new Date(data));
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Error in fetchNextOperationTime:', error);
      
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 5000);
        
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchNextOperationTime();
          }
        }, delay);
      } else {
        const fallbackTime = addMinutes(new Date(), 1);
        if (isMountedRef.current) {
          setNextOperationTime(fallbackTime);
          toast.error('Erro ao conectar com o servidor. Usando tempo estimado.');
        }
      }
    }
  }, [investmentId, isOperating, operationCompleted]);

  const handleOperationStart = async () => {
    if (!isMountedRef.current || isOperating) {
      return;
    }

    setIsOperating(true);

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
        setCurrentBalance(updatedInvestment.current_balance);
        
        if (earned > 0) {
          toast.success(`Operação concluída! Rendimento: R$ ${earned.toFixed(2)}`);
        }
      }

      if (isMountedRef.current) {
        setNextOperationTime(nextOperation);
      }
    } catch (error) {
      console.error('Operation error:', error);
      toast.error('Erro durante a operação. Tente novamente em alguns minutos.');
      
      if (isMountedRef.current) {
        setIsOperating(false);
      }
    }
  };

  const handleOperationComplete = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setIsOperating(false);
    setOperationCompleted(true);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setOperationCompleted(false);
        fetchNextOperationTime();
      }
    }, 5000);
  }, [fetchNextOperationTime]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isOperating && !operationCompleted) {
      fetchNextOperationTime();
      
      const interval = setInterval(() => {
        if (isMountedRef.current && !isOperating && !operationCompleted) {
          fetchNextOperationTime();
        }
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }

    return () => {
      isMountedRef.current = false;
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