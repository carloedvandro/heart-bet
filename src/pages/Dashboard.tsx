import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Card } from "@/components/ui/card";
import { ProfileActions } from "@/components/dashboard/ProfileActions";
import { BetsTable } from "@/components/dashboard/BetsTable";
import BettingForm from "@/components/betting/BettingForm";
import { RechargeDialog } from "@/components/dashboard/RechargeDialog";
import { BalanceDisplay } from "@/components/dashboard/BalanceDisplay";
import { AudioControl } from "@/components/dashboard/AudioControl";
import { Profile } from "@/integrations/supabase/custom-types";

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const session = useSession();

  useAuthRedirect();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

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
      }
    };

    fetchProfile();
  }, [session]);

  const handleBetPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-800">Corações Premiados</h1>
              <BalanceDisplay profile={profile} />
            </div>
            <div className="flex items-center gap-4">
              <AudioControl />
              <RechargeDialog />
              <ProfileActions 
                isAdmin={profile?.is_admin} 
                setProfile={setProfile}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Nova Aposta</h2>
              <BettingForm onBetPlaced={handleBetPlaced} />
            </div>
          </Card>

          <Card className="bg-white/90 backdrop-blur">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Suas Apostas</h2>
              <BetsTable refreshTrigger={refreshTrigger} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}