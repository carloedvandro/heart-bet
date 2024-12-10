import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Admin() {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        toast.error("Acesso não autorizado");
        navigate("/dashboard");
      }
    };

    checkAdminStatus();
  }, [session, navigate]);

  // Query para buscar apostas de hoje com valor total
  const { data: todayBetsData } = useQuery({
    queryKey: ['admin', 'today-bets'],
    queryFn: async () => {
      console.log("Buscando apostas de hoje...");
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bets')
        .select('amount')
        .eq('draw_date', today);

      if (error) {
        console.error("Erro ao buscar apostas:", error);
        throw error;
      }
      
      const total = data?.reduce((acc, bet) => acc + Number(bet.amount), 0) || 0;
      return {
        count: data?.length || 0,
        total: total
      };
    }
  });

  // Query para buscar recargas pendentes com valor total
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
    }
  });

  // Query para buscar usuários ativos (com apostas nos últimos 7 dias)
  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users-stats'],
    queryFn: async () => {
      console.log("Buscando estatísticas de usuários...");
      
      // Buscar total de usuários
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Buscar usuários ativos (com apostas nos últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: activeBettors, error: activeError } = await supabase
        .from('bets')
        .select('user_id')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      // Contar usuários únicos ativos
      const uniqueActiveBettors = new Set(activeBettors?.map(bet => bet.user_id));

      return {
        total: totalUsers || 0,
        active: uniqueActiveBettors.size
      };
    }
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/login");
      toast.success("Desconectado com sucesso");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast.error("Erro ao desconectar");
    }
  };

  if (!session) return null;

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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Apostas Hoje</h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{todayBetsData?.count ?? '...'}</p>
              <p className="text-sm text-gray-500">Total de apostas</p>
              <p className="text-xl font-semibold text-green-600">
                R$ {todayBetsData?.total?.toFixed(2) ?? '0.00'}
              </p>
              <p className="text-sm text-gray-500">Valor total apostado</p>
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