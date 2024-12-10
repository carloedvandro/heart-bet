import { Profile } from "@/integrations/supabase/custom-types";
import { BalanceDisplay } from "./BalanceDisplay";
import { RechargeDialog } from "./RechargeDialog";
import { AudioControl } from "./AudioControl";
import { LogoutButton } from "./LogoutButton";
import { ProfileActions } from "./ProfileActions";

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
  setProfile: (profile: Profile | null) => void;
}

export function Header({ profile, onLogout, setProfile }: HeaderProps) {
  return (
    <div className="relative z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Corações Premiados</h1>
        <div className="flex items-center gap-3">
          <AudioControl />
          <BalanceDisplay profile={profile} />
          <RechargeDialog />
          <LogoutButton onLogout={onLogout} />
          <ProfileActions 
            isAdmin={profile?.is_admin ?? false} 
            setProfile={setProfile}
          />
        </div>
      </div>
    </div>
  );
}