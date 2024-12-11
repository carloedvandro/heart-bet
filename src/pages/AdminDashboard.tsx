import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Upload, Users } from "lucide-react";
import { DailyBetsList } from "@/components/admin/DailyBetsList";

interface DashboardStats {
  dailyBets: number;
  pendingRecharges: number;
  totalUsers: number;
}

interface DailyBet {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    email: string | null;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    dailyBets: 0,
    pendingRecharges: 0,
    totalUsers: 0,
  });
  const [dailyBetsList, setDailyBetsList] = useState<DailyBet[]>([]);
  const [showBetsDialog, setShowBetsDialog] = useState(false);

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
      // Fetch daily bets with user email
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching bets for date:', today);
      
      const { data: dailyBets, error: betsError } = await supabase
        .from('bets')
        .select(`
          id,
          user_id,
          amount,
          created_at,
          profiles (
            email
          )
        `)
        .eq('draw_date', today);

      if (betsError) {
        console.error('Error fetching daily bets:', betsError);
        throw betsError;
      }

      console.log('Daily bets data:', dailyBets);
      setDailyBetsList(dailyBets || []);

      // Fetch pending recharges
      const { data: pendingRecharges, error: rechargesError } = await supabase
        .from('recharges')
        .select('*')
        .eq('status', 'pending');

      if (rechargesError) {
        console.error('Error fetching pending recharges:', rechargesError);
        throw rechargesError;
      }

      // Fetch total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching total users:', usersError);
        throw usersError;
      }

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
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowBetsDialog(true)}
            >
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

      <DailyBetsList
        open={showBetsDialog}
        onOpenChange={setShowBetsDialog}
        bets={dailyBetsList}
      />
    </div>
  );
}