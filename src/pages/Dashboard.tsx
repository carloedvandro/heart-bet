import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import HeartGrid from "@/components/HeartGrid";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { BetsTable } from "@/components/dashboard/BetsTable";
import { useSession } from "@supabase/auth-helpers-react";
import { playSounds } from "@/utils/soundEffects";

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, navigate]);

  // Initial profile fetch and session check
  useEffect(() => {
    if (!session) {
      console.log("No session in useEffect, redirecting to login");
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [session, navigate, fetchProfile]);

  // Configurar escuta de notificações de recarga
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
        (payload) => {
          if (payload.new.status === 'completed' && payload.old.status === 'pending') {
            console.log('Recarga completada:', payload.new);
            playSounds.recharge();
            fetchProfile();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, fetchProfile]);

  // Refresh profile periodically
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [session?.user?.id, fetchProfile]);

  const handleLogout = async () => {
    try {
      console.log("Starting logout process");
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erro ao desconectar");
        return;
      }

      console.log("Logout successful, clearing state and navigating");
      setProfile(null);
      navigate("/login");
      toast.success("Desconectado com sucesso");
      
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Erro inesperado ao desconectar");
    }
  };

  if (!session) {
    console.log("No session in render, returning null");
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <Header profile={profile} onLogout={handleLogout} />

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Nova Aposta</CardTitle>
          </CardHeader>
          <CardContent>
            <HeartGrid onBetPlaced={() => setRefreshTrigger(prev => prev + 1)} />
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Suas Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            <BetsTable refreshTrigger={refreshTrigger} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}