import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UseTradeOperationProps {
  investmentId: string;
}

export function useTradeOperation({ investmentId }: UseTradeOperationProps) {
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const queryClient = useQueryClient();

  const handleOperationStart = async () => {
    setIsOperating(true);
    try {
      const now = new Date();
      const nextOperation = new Date(now.getTime() + 60 * 1000); // 1 minute for testing

      const { error } = await supabase
        .from('trade_operations')
        .insert({
          investment_id: investmentId,
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
      const { data, error: balanceError } = await supabase
        .from('trade_investments')
        .select('current_balance')
        .eq('id', investmentId)
        .single();

      if (balanceError) throw balanceError;
      
      if (data) {
        // Forçar atualização dos dados do investimento
        queryClient.invalidateQueries({ queryKey: ['trade-investments'] });
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

  return {
    isOperating,
    operationCompleted,
    handleOperationStart,
    handleOperationComplete
  };
}