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
      // Primeiro, verificar se o investimento ainda está ativo
      const { data: currentInvestment, error: checkError } = await supabase
        .from('trade_investments')
        .select('amount, status')
        .eq('id', investmentId)
        .single();

      if (checkError) throw checkError;

      if (!currentInvestment) {
        playSounds.error();
        toast.error("Investimento não encontrado");
        return;
      }

      if (currentInvestment.status !== 'active') {
        playSounds.error();
        toast.error("Este investimento já foi cancelado");
        return;
      }

      // Usar uma transação RPC para garantir atomicidade
      const { error: cancelError } = await supabase
        .rpc('cancel_investment', { investment_id: investmentId });

      if (cancelError) {
        throw cancelError;
      }

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