import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { useSession } from "@supabase/auth-helpers-react";
import { playSounds } from "@/utils/soundEffects";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

type Profile = Database['public']['Tables']['profiles']['Row'];
type RechargeRow = Database['public']['Tables']['recharges']['Row'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);

  const fetchProfile = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        console.log("No session found, redirecting to login");
        navigate("/login");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      
      if (data && data.balance > previousBalance) {
        console.log('Balance increased, playing coin sound');
        await playSounds.coin();
      }
      
      setPreviousBalance(data?.balance || 0);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, navigate, previousBalance]);

  useEffect(() => {
    if (!session) {
      console.log("No session in useEffect, redirecting to login");
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [session, navigate, fetchProfile]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase.channel('recharge_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recharges',
          filter: `user_id=eq.${session.user.id}`,
        },
        async (payload) => {
          const newData = payload.new as RechargeRow;
          const oldData = payload.old as RechargeRow;
          
          if (newData.status === 'completed' && oldData.status === 'pending') {
            await playSounds.recharge();
            toast.success(`Recarga de R$ ${newData.amount} completada!`);
            await fetchProfile();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, fetchProfile]);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000);

    return () => clearInterval(interval);
  }, [session?.user?.id, fetchProfile]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erro ao desconectar");
        return;
      }

      setProfile(null);
      navigate("/login");
      toast.success("Desconectado com sucesso");
      
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Erro inesperado ao desconectar");
    }
  };

  if (!session) return null;

  return (
    <div 
      className="min-h-screen p-4 md:p-6 bg-cover bg-center relative overflow-x-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-gradient-x"
        style={{
          backdropFilter: 'blur(1px)',
        }}
      />
      
      {/* Content wrapper with glass effect */}
      <div className="relative z-10">
        <Header profile={profile} onLogout={handleLogout} />
        <DashboardContent 
          profile={profile}
          refreshTrigger={refreshTrigger}
          onBetPlaced={() => setRefreshTrigger(prev => prev + 1)}
        />
      </div>
    </div>
  );
}