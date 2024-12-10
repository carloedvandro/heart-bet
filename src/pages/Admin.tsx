import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAdminStatus } from "@/hooks/useAdminStatus";

export default function Admin() {
  const navigate = useNavigate();
  const session = useSession();
  const { isAdmin, isLoading } = useAdminStatus();

  // Query para buscar TODAS as apostas de hoje com valor total
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
      
      // Se não houver dados, retorna valores zerados
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
    enabled: !isLoading && isAdmin // Only run query when admin status is confirmed
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
    enabled: !isLoading && isAdmin // Only run query when admin status is confirmed
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
    enabled: !isLoading && isAdmin // Only run query when admin status is confirmed
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/admin-login");
      toast.success("Desconectado com sucesso");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast.error("Erro ao desconectar");
    }
  };

  // Se estiver carregando ou não for admin, mostra nada
  if (isLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/admin-login")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {
              console.log("Navegando para a página de apostas detalhadas...");
              navigate("/admin/bets");
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Apostas Hoje</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{todayBetsData?.count ?? '...'}</p>
              <p className="text-sm text-gray-500">Total de apostas</p>
              <p className="text-xl font-semibold text-green-600">
                R$ {todayBetsData?.total?.toFixed(2) ?? '0.00'}
              </p>
              <p className="text-sm text-gray-500">Valor total apostado</p>
              <p className="text-md font-medium text-blue-600">
                {todayBetsData?.uniqueBettors ?? '0'} apostadores únicos
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recargas Pendentes</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{pendingRechargesData?.count ?? '...'}</p>
              <p className="text-sm text-gray-500">Aguardando aprovação</p>
              <p className="text-xl font-semibold text-blue-600">
                R$ {pendingRechargesData?.total?.toFixed(2) ?? '0.00'}
              </p>
              <p className="text-sm text-gray-500">Valor total pendente</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Usuários</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{usersData?.total ?? '...'}</p>
              <p className="text-sm text-gray-500">Total de usuários</p>
              <p className="text-xl font-semibold text-purple-600">
                {usersData?.active ?? '0'}
              </p>
              <p className="text-sm text-gray-500">Ativos nos últimos 7 dias</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}