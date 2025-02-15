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

// Floating heart component with enhanced animation
const FloatingHeart = ({ index }: { index: number }) => {
  const randomDelay = `${index * 0.5}s`;
  const randomDuration = `${6 + Math.random() * 4}s`;
  const randomLeft = `${Math.random() * 100}vw`;
  const randomRotate = `${Math.random() * 360}deg`;
  const randomSize = `${20 + Math.random() * 20}px`;
  
  return (
    <div
      className="absolute text-heart-red animate-float opacity-20 hover:opacity-40 transition-opacity"
      style={{
        left: randomLeft,
        animationDelay: randomDelay,
        animationDuration: randomDuration,
        '--float-r': randomRotate,
        '--float-x': `${-50 + Math.random() * 100}px`,
        fontSize: randomSize,
      } as React.CSSProperties}
    >
      ❤️
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
  }, []);

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
      className={`min-h-screen relative overflow-x-hidden ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-cover bg-center bg-fixed'
      }`}
      style={theme === 'light' ? {
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      } : undefined}
    >
      {/* Floating hearts in dark mode with improved performance */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, index) => (
            <FloatingHeart key={index} index={index} />
          ))}
        </div>
      )}
      
      {/* Enhanced gradient overlay with smoother animation */}
      <div 
        className={`fixed inset-0 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-purple-500/5 via-pink-500/10 to-purple-500/5' 
            : 'bg-gradient-to-br from-red-900/5 via-pink-900/10 to-red-800/5'
        } animate-gradient-x`}
        style={{
          backdropFilter: theme === 'light' ? 'blur(1px)' : 'none',
        }}
      />
      
      {/* Main content with improved scrolling */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header profile={profile} onLogout={handleLogout} />
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="max-w-[1920px] mx-auto">
            <DashboardContent 
              profile={profile}
              refreshTrigger={refreshTrigger}
              onBetPlaced={() => setRefreshTrigger(prev => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}