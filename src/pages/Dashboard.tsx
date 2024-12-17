import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Header } from "@/components/dashboard/Header";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FloatingHearts } from "@/components/FloatingHearts";

export default function Dashboard() {
  const { view } = useParams<{ view?: string }>();
  const { profile } = useProfile();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBetPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/80 to-gray-100/80">
      <FloatingHearts />
      <div className="container mx-auto px-4 py-8">
        <Header profile={profile} />
        <DashboardContent
          profile={profile}
          refreshTrigger={refreshTrigger}
          onBetPlaced={handleBetPlaced}
          initialView={view as 'bet' | 'investment' | 'trade' | 'bets' | 'profile'}
        />
        <DashboardNavigation />
      </div>
    </div>
  );
}