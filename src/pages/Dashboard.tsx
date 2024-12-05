import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import HeartGrid from "@/components/HeartGrid";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { BetsTable } from "@/components/dashboard/BetsTable";
import { useSession } from "@supabase/auth-helpers-react";

type Bet = Database['public']['Tables']['bets']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
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
      }
    };

    const fetchBets = async () => {
      try {
        const { data, error } = await supabase
          .from("bets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBets(data || []);
      } catch (error) {
        console.error("Error fetching bets:", error);
        toast.error("Erro ao carregar apostas");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchBets();
  }, [session, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) {
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
            <HeartGrid />
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Suas Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            <BetsTable bets={bets} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}