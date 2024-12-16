import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";

export function useInvestments() {
  const { data: investments, isLoading, refetch } = useQuery({
    queryKey: ['trade-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_investments')
        .select('*, trade_earnings(sum:amount)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleCancelInvestment = async (investmentId: string) => {
    try {
      const { data: investment } = await supabase
        .from('trade_investments')
        .select('amount, status')
        .eq('id', investmentId)
        .single();

      if (!investment) {
        throw new Error('Investimento não encontrado');
      }

      if (investment.status !== 'active') {
        playSounds.error();
        toast.error("Este investimento já foi cancelado");
        return;
      }

      const { error: updateError } = await supabase
        .from('trade_investments')
        .update({ 
          status: 'cancelled',
          current_balance: investment.amount
        })
        .eq('id', investmentId);

      if (updateError) throw updateError;

      const { error: balanceError } = await supabase
        .rpc('increment_balance', { amount: investment.amount });

      if (balanceError) throw balanceError;

      playSounds.success();
      toast.success("Investimento cancelado com sucesso!");
      
      await refetch();
    } catch (error) {
      console.error('Erro ao cancelar investimento:', error);
      playSounds.error();
      toast.error("Erro ao cancelar investimento");
    }
  };

  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const totalEarnings = investments?.reduce((sum, inv) => sum + Number(inv.trade_earnings?.[0]?.sum || 0), 0) || 0;

  return {
    investments,
    isLoading,
    totalInvested,
    totalEarnings,
    handleCancelInvestment,
    refetchInvestments: refetch
  };
}