import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { TradeCard } from "../trade/TradeCard";
import { ViewResultsDialog } from "../results/ViewResultsDialog";

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
    <div className="space-y-6 relative z-10">
      <div className="flex justify-end mb-4">
        <ViewResultsDialog />
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="opacity-90 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/95 transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nova Aposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HeartGrid onBetPlaced={onBetPlaced} />
          </CardContent>
        </Card>

        <TradeCard />
      </div>

      <Card className="opacity-90 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/95 transition-all duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Suas Apostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BetsTable refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
};