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
  }, [session?.user?.id]);

  // Initial profile fetch and session check
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [session, navigate, fetchProfile]);

  // Refresh profile periodically
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [session?.user?.id, fetchProfile]);

  if (!session) return null;

  return (
    <div 
      className="min-h-screen bg-gray-50 p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <Header profile={profile} onLogout={async () => {
          await supabase.auth.signOut();
          navigate("/login");
        }} />

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