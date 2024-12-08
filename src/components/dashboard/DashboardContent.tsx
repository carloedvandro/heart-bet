import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
}

export const DashboardContent = ({ 
  profile, 
  refreshTrigger, 
  onBetPlaced 
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