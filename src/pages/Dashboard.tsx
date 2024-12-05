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
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      console.log("Fetched profile:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session) {
      console.log("No session detected, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("Session detected, fetching profile");
    fetchProfile();
  }, [session, navigate, fetchProfile]);

  useRealtimeSubscription({
    channel: `profile_${session?.user?.id || 'anonymous'}`,
    table: 'profiles',
    filter: session?.user?.id ? `id=eq.${session.user.id}` : undefined,
    onChanged: fetchProfile,
    enabled: !!session?.user?.id
  });

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