import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { playSounds } from "@/utils/soundEffects";
import { useSession } from "@supabase/auth-helpers-react";

export function useInvestments() {
  const session = useSession();

  const { data: investments, isLoading, refetch } = useQuery({
    queryKey: ['trade-investments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('trade_investments')
        .select('*, trade_earnings(sum:amount)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
    enabled: !!session?.user?.id, // Só executa a query se houver um usuário logado
  });

  const handleCancelInvestment = async (investmentId: string) => {
    try {
      const { data: currentInvestment, error: checkError } = await supabase
        .from('trade_investments')
        .select('amount, status')
        .eq('id', investmentId)
        .eq('user_id', session?.user?.id) // Garante que o investimento pertence ao usuário
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

  const totalInvested = investments?.reduce((sum, inv) => 
    inv.status === 'active' ? sum + Number(inv.amount) : sum, 0) || 0;
    
  const totalEarnings = investments?.reduce((sum, inv) => 
    sum + Number(inv.trade_earnings?.[0]?.sum || 0), 0) || 0;

  return {
    investments,
    isLoading,
    totalInvested,
    totalEarnings,
    handleCancelInvestment,
    refetchInvestments: refetch
  };
}