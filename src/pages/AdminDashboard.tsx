import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Upload, Users } from "lucide-react";

interface DashboardStats {
  dailyBets: number;
  pendingRecharges: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    dailyBets: 0,
    pendingRecharges: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        toast.error("Acesso não autorizado");
        navigate("/admin/login");
      }
    };

    checkAdminAccess();
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch daily bets
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyBets } = await supabase
        .rpc('get_all_bets_today', { today_date: today });

      // Fetch pending recharges
      const { data: pendingRecharges } = await supabase
        .from('recharges')
        .select('*')
        .eq('status', 'pending');

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        dailyBets: dailyBets?.length || 0,
        pendingRecharges: pendingRecharges?.length || 0,
        totalUsers: totalUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error("Erro ao carregar estatísticas");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Apostas do Dia
                </CardTitle>
                <ChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.dailyBets}</div>
                <p className="text-xs text-muted-foreground">
                  apostas realizadas hoje
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recargas Solicitadas
                </CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRecharges}</div>
                <p className="text-xs text-muted-foreground">
                  recargas pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  usuários registrados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}