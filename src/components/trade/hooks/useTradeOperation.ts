import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeOperation = (investmentId: string, amount: number, dailyRate: number, initialBalance: number) => {
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);

  const handleOperationStart = async () => {
    console.log('=== Starting Trade Operation ===');
    console.log('Investment Details:', {
      id: investmentId,
      amount,
      dailyRate,
      currentBalance
    });
    
    setIsOperating(true);
    
    try {
      const now = new Date();
      const nextOperation = new Date(now.getTime() + 10 * 1000);

      console.log('Registering operation at:', now.toISOString());
      console.log('Next operation scheduled for:', nextOperation.toISOString());

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
      
      // Adicionar um pequeno delay para garantir que a operação seja registrada
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: earningsData, error: earningsError } = await supabase
        .rpc('calculate_daily_earnings');

      if (earningsError) {
        console.error('Earnings calculation error:', earningsError);
        throw earningsError;
      }

      console.log('calculate_daily_earnings response:', earningsData);

      // Adicionar um pequeno delay para garantir que os rendimentos sejam calculados
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Fetching updated investment data...');
      const { data: updatedInvestment, error: fetchError } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investmentId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated balance:', fetchError);
        throw fetchError;
      }

      console.log('Updated investment data:', updatedInvestment);

      if (updatedInvestment) {
        console.log('=== Operation Results ===');
        console.log('Previous balance:', currentBalance);
        console.log('New balance:', updatedInvestment.current_balance);
        
        const earned = updatedInvestment.current_balance - currentBalance;
        console.log('Calculated earnings:', earned);
        
        setCurrentBalance(updatedInvestment.current_balance);
        
        if (earned > 0) {
          toast.success(`Operação concluída! Rendimento: R$ ${earned.toFixed(2)}`);
        } else {
          console.warn('No earnings registered for this operation');
          toast.info('Operação concluída, mas nenhum rendimento foi registrado para este período.');
        }
      }

    } catch (error) {
      console.error('Operation error:', error);
      toast.error('Erro durante a operação');
    } finally {
      setIsOperating(false);
    }
  };

  const handleOperationComplete = async () => {
    console.log('=== Operation Complete ===');
    setIsOperating(false);
    setOperationCompleted(true);
    
    try {
      const { data, error } = await supabase
        .from('trade_investments')
        .select('current_balance, trade_earnings(amount)')
        .eq('id', investmentId)
        .single();

      if (error) {
        console.error('Error fetching final balance:', error);
        throw error;
      }
      
      console.log('Final investment data:', data);
      
      if (data) {
        const earned = data.current_balance - currentBalance;
        console.log('Final earnings calculation:', earned);
        setCurrentBalance(data.current_balance);
      }

      setTimeout(() => {
        setOperationCompleted(false);
      }, 10000);

    } catch (error) {
      console.error('Error updating final balance:', error);
      toast.error('Erro ao atualizar saldo');
    }
  };

  return {
    isOperating,
    operationCompleted,
    currentBalance,
    handleOperationStart,
    handleOperationComplete
  };
};