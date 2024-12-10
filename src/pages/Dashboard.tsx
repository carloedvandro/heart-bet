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
        <div className="grid gap-6 md:grid-cols-[300px,1fr]">
          <div className="space-y-6">
            <Card className="p-4 space-y-4">
              <BalanceDisplay profile={profile} />
              <ProfileActions 
                isAdmin={profile?.is_admin} 
                setProfile={setProfile}
              />
            </Card>
            <AudioControl />
            <RechargeDialog />
          </div>

          <div className="space-y-6">
            <BettingForm onBetPlaced={handleBetPlaced} />
            <BetsTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}