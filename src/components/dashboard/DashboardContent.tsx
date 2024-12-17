import { Profile } from "@/integrations/supabase/custom-types";
import { ProfileLayout } from "./profile/ProfileLayout";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
  initialView?: string;
}

export function DashboardContent({ profile, refreshTrigger, onBetPlaced, initialView }: DashboardContentProps) {
  return (
    <main className="pb-24">
      <ProfileLayout profile={profile} />
    </main>
  );
}