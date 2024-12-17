import { Profile } from "@/integrations/supabase/custom-types";
import { ProfileLayout } from "./profile/ProfileLayout";
import { useLocation } from "react-router-dom";
import { TradeCard } from "../trade/TradeCard";
import BettingForm from "../betting/BettingForm";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
  initialView?: string;
}

export function DashboardContent({ profile, refreshTrigger, onBetPlaced, initialView }: DashboardContentProps) {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'profile';

  const renderContent = () => {
    switch (currentPath) {
      case 'trade':
        return <TradeCard />;
      case 'profile':
        return <ProfileLayout profile={profile} />;
      case 'bet':
        return <BettingForm onBetPlaced={onBetPlaced} />;
      // Temporarily show "Em desenvolvimento" for other views
      case 'investment':
      case 'bets':
        return (
          <div className="p-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Em desenvolvimento</h2>
            <p className="text-gray-600">Esta funcionalidade estará disponível em breve.</p>
          </div>
        );
      default:
        return <ProfileLayout profile={profile} />;
    }
  };

  return (
    <main className="pb-24">
      {renderContent()}
    </main>
  );
}