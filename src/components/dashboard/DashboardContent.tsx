import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { TradeCard } from "../trade/TradeCard";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
  initialView?: 'bet' | 'investment' | 'trade' | 'bets' | 'profile';
}

export const DashboardContent = ({ 
  profile, 
  refreshTrigger, 
  onBetPlaced,
  initialView = 'bet'
}: DashboardContentProps) => {
  const renderContent = () => {
    switch (initialView) {
      case 'bet':
        return (
          <Card className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader>
              <CardTitle>Nova Aposta</CardTitle>
            </CardHeader>
            <CardContent>
              <HeartGrid onBetPlaced={onBetPlaced} />
            </CardContent>
          </Card>
        );
      
      case 'trade':
        return <TradeCard />;
      
      case 'bets':
        return (
          <Card className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader>
              <CardTitle>Suas Apostas</CardTitle>
            </CardHeader>
            <CardContent>
              <BetsTable refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader>
              <CardTitle>Em construção</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Esta seção está sendo implementada.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {renderContent()}
    </div>
  );
}