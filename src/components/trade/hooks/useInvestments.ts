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

      // Fetch investments with their total earnings using sum aggregation
      const { data, error } = await supabase
        .from('trade_investments')
        .select(`
          *,
          trade_earnings!inner(amount)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Log the raw data for debugging
      console.log('Raw investments data:', data);
      
      return data;
    },
    staleTime: 1000 * 60, // Cache por 1 minuto
    refetchInterval: 1000 * 60, // Atualiza a cada 1 minuto
    enabled: !!session?.user?.id,
  });

  const handleCancelInvestment = async (investmentId: string) => {
    try {
      const { data: currentInvestment, error: checkError } = await supabase
        .from('trade_investments')
        .select('amount, status')
        .eq('id', investmentId)
        .eq('user_id', session?.user?.id)
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

  // Calculate total invested amount only from active investments
  const totalInvested = investments?.reduce((sum, inv) => 
    inv.status === 'active' ? sum + Number(inv.amount) : sum, 0) || 0;
    
  // Calculate total earnings by summing up all earnings
  const totalEarnings = investments?.reduce((sum, inv) => {
    // Log individual investment earnings for debugging
    console.log(`Investment ${inv.id} earnings:`, inv.trade_earnings);
    
    const investmentEarnings = inv.trade_earnings?.reduce((earningSum: number, earning: any) => {
      const earningAmount = Number(earning.amount) || 0;
      console.log(`Adding earning amount: ${earningAmount}`);
      return earningSum + earningAmount;
    }, 0) || 0;
    
    console.log(`Total earnings for investment ${inv.id}: ${investmentEarnings}`);
    return sum + investmentEarnings;
  }, 0) || 0;

  // Log final calculations for debugging
  console.log('Total invested:', totalInvested);
  console.log('Total earnings:', totalEarnings);

  return {
    investments,
    isLoading,
    totalInvested,
    totalEarnings,
    handleCancelInvestment,
    refetchInvestments: refetch
  };
}