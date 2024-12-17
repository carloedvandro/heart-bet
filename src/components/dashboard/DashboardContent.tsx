import { Profile } from "@/integrations/supabase/custom-types";
import { ProfileLayout } from "./profile/ProfileLayout";
import { BetLayout } from "./bet/BetLayout";
import { InvestmentLayout } from "./investment/InvestmentLayout";
import { TradeLayout } from "./trade/TradeLayout";
import { BetsLayout } from "./bets/BetsLayout";
import { useEffect, useState } from "react";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
  initialView?: string;
}

export function DashboardContent({ profile, refreshTrigger, onBetPlaced, initialView }: DashboardContentProps) {
  const [currentView, setCurrentView] = useState(initialView || "home");

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  const renderContent = () => {
    switch (currentView) {
      case "bet":
        return <BetLayout profile={profile} onBetPlaced={onBetPlaced} />;
      case "investment":
        return <InvestmentLayout profile={profile} />;
      case "trade":
        return <TradeLayout profile={profile} />;
      case "bets":
        return <BetsLayout profile={profile} refreshTrigger={refreshTrigger} />;
      case "profile":
        return <ProfileLayout profile={profile} />;
      default:
        return <BetLayout profile={profile} onBetPlaced={onBetPlaced} />;
    }
  };

  return (
    <main className="pb-24">
      {renderContent()}
    </main>
  );
}