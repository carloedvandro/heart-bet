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
      // Buscar informações do investimento
      const { data: investment, error: investmentError } = await supabase
        .from('trade_investments')
        .select('amount, daily_rate, current_balance')
        .eq('id', investmentId)
        .single();

      if (investmentError) {
        console.error('Error fetching investment:', investmentError);
        throw investmentError;
      }
      
      if (investment) {
        console.log('Investment data:', investment);
        const earningAmount = Number((investment.amount * (investment.daily_rate / 100)).toFixed(2));
        console.log('Calculated earning amount:', earningAmount);
        
        // Registrar o rendimento usando a data atual no fuso horário de São Paulo
        const now = new Date();
        const earned_at = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        console.log('Inserting earning with data:', {
          investment_id: investmentId,
          amount: earningAmount,
          earned_at
        });

        const { error: earningError } = await supabase
          .from('trade_earnings')
          .insert({
            investment_id: investmentId,
            amount: earningAmount,
            earned_at
          });

        if (earningError) {
          console.error('Error inserting earning:', earningError);
          throw earningError;
        }

        // Atualizar o saldo atual do investimento
        const newBalance = Number(investment.current_balance) + earningAmount;
        console.log('Updating investment balance to:', newBalance);
        
        const { error: updateError } = await supabase
          .from('trade_investments')
          .update({ current_balance: newBalance })
          .eq('id', investmentId);

        if (updateError) {
          console.error('Error updating investment balance:', updateError);
          throw updateError;
        }

        // Forçar atualização dos dados do investimento
        queryClient.invalidateQueries({ queryKey: ['trade-investments'] });
        console.log('Operation completed successfully');
      }

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