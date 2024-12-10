import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

  const { data: todayBets } = useQuery({
    queryKey: ['admin', 'today-bets'],
    queryFn: async () => {
      console.log("Buscando apostas de hoje...");
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('draw_date', today);

      if (error) {
        console.error("Erro ao buscar apostas:", error);
        throw error;
      }
      
      console.log("Total de apostas hoje:", count);
      return count || 0;
    }
  });

  const { data: pendingRecharges } = useQuery({
    queryKey: ['admin', 'pending-recharges'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('recharges')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: totalUsers } = useQuery({
    queryKey: ['admin', 'total-users'],
    queryFn: async () => {
      console.log("Buscando total de usuários...");
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Erro ao buscar total de usuários:", error);
        throw error;
      }

      console.log("Total de usuários encontrados:", count);
      return count || 0;
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
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Apostas Hoje</h3>
            <p className="text-3xl font-bold">{todayBets ?? '...'}</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Recargas Pendentes</h3>
            <p className="text-3xl font-bold">{pendingRecharges ?? '...'}</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total de Usuários</h3>
            <p className="text-3xl font-bold">{totalUsers ?? '...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}