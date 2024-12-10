import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { useAdminStatus } from "@/hooks/useAdminStatus";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminStatus();

  const { data: todayBetsData } = useQuery({
    queryKey: ['admin', 'today-bets'],
    queryFn: async () => {
      console.log("Buscando todas as apostas de hoje...");
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .rpc('get_all_bets_today', { today_date: today });

      if (error) {
        console.error("Erro ao buscar apostas:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return {
          count: 0,
          total: 0,
          uniqueBettors: 0
        };
      }

      const total = data.reduce((acc, bet) => acc + Number(bet.amount), 0);
      const uniqueBettors = new Set(data.map(bet => bet.user_id)).size;

      return {
        count: data.length,
        total: total,
        uniqueBettors: uniqueBettors
      };
    },
    enabled: !isLoading && isAdmin
  });

  const { data: pendingRechargesData } = useQuery({
    queryKey: ['admin', 'pending-recharges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recharges')
        .select('amount')
        .eq('status', 'pending');

      if (error) throw error;

      const total = data?.reduce((acc, recharge) => acc + Number(recharge.amount), 0) || 0;
      return {
        count: data?.length || 0,
        total: total
      };
    },
    enabled: !isLoading && isAdmin
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users-stats'],
    queryFn: async () => {
      console.log("Buscando estatísticas de usuários...");
      
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: activeBettors, error: activeError } = await supabase
        .from('bets')
        .select('user_id')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      const uniqueActiveBettors = new Set(activeBettors?.map(bet => bet.user_id));

      return {
        total: totalUsers || 0,
        active: uniqueActiveBettors.size
      };
    },
    enabled: !isLoading && isAdmin
  });

  if (isLoading || !isAdmin) return null;

  return (
    <AdminLayout title="Painel Administrativo">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Apostas Hoje"
          mainValue={todayBetsData?.count ?? '...'}
          mainLabel="Total de apostas"
          secondaryValue={`R$ ${todayBetsData?.total?.toFixed(2) ?? '0.00'}`}
          secondaryLabel="Valor total apostado"
          tertiaryValue={`${todayBetsData?.uniqueBettors ?? '0'} apostadores únicos`}
          tertiaryLabel="Apostadores únicos hoje"
          onClick={() => {
            console.log("Navegando para a página de apostas detalhadas...");
            navigate("/admin/bets");
          }}
        />

        <DashboardCard
          title="Recargas Pendentes"
          mainValue={pendingRechargesData?.count ?? '...'}
          mainLabel="Aguardando aprovação"
          secondaryValue={`R$ ${pendingRechargesData?.total?.toFixed(2) ?? '0.00'}`}
          secondaryLabel="Valor total pendente"
        />

        <DashboardCard
          title="Usuários"
          mainValue={usersData?.total ?? '...'}
          mainLabel="Total de usuários"
          secondaryValue={usersData?.active ?? '0'}
          secondaryLabel="Ativos nos últimos 7 dias"
        />
      </div>
    </AdminLayout>
  );
}