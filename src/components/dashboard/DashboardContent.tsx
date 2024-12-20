import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { TradeCard } from "../trade/TradeCard";

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
    <div className="max-w-7xl mx-auto space-y-8 p-4 relative z-10">
      <Card className="transform transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none shadow-xl hover:shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="space-y-2 pb-6 border-b border-purple-100/20">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Aposta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <HeartGrid onBetPlaced={onBetPlaced} />
        </CardContent>
      </Card>

      <TradeCard />

      <Card className="transform transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none shadow-xl hover:shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="space-y-2 pb-6 border-b border-purple-100/20">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Suas Apostas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <BetsTable refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
};