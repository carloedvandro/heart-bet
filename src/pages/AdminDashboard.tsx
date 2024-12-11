import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Upload, Users } from "lucide-react";
import { DailyBetsList } from "@/components/admin/DailyBetsList";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date>();

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
      // Fetch pending recharges
      const { data: pendingRecharges, error: rechargesError } = await supabase
        .from('recharges')
        .select('*')
        .eq('status', 'pending');

      if (rechargesError) throw rechargesError;

      // Fetch total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      setStats({
        dailyBets: dailyBetsList.length,
        pendingRecharges: pendingRecharges?.length || 0,
        totalUsers: totalUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error("Erro ao carregar estatísticas");
    }
  };

  const fetchBetsForDate = async (date: Date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const startOfDay = `${formattedDate}T00:00:00`;
      const endOfDay = `${formattedDate}T23:59:59`;
      
      console.log('Fetching bets between:', startOfDay, 'and', endOfDay);
      
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
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay);

      if (betsError) throw betsError;

      console.log('Daily bets data:', dailyBets);
      setDailyBetsList(dailyBets || []);
      setStats(prev => ({
        ...prev,
        dailyBets: dailyBets?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching daily bets:', error);
      toast.error("Erro ao carregar apostas do dia");
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchBetsForDate(date);
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
                  {selectedDate 
                    ? `apostas em ${format(selectedDate, "dd/MM/yyyy")}`
                    : "selecione uma data"}
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
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
    </div>
  );
}