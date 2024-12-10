import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { AdminAccessButton } from "./AdminAccessButton";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
  setProfile: (profile: Profile | null) => void;
}

export const DashboardContent = ({ 
  profile, 
  refreshTrigger, 
  onBetPlaced,
  setProfile
}: DashboardContentProps) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <Card className="bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Nova Aposta</CardTitle>
        </CardHeader>
        <CardContent>
          <HeartGrid onBetPlaced={onBetPlaced} />
        </CardContent>
      </Card>

      {profile?.is_admin && (
        <div className="flex justify-center py-2">
          <AdminAccessButton setProfile={setProfile} />
        </div>
      )}

      <Card className="bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Suas Apostas</CardTitle>
        </CardHeader>
        <CardContent>
          <BetsTable refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
};