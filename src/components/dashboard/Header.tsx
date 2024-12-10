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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-800">Corações Premiados</h1>
          <BalanceDisplay profile={profile} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <AudioControl />
          <RechargeDialog />
          <ProfileActions 
            isAdmin={profile?.is_admin ?? false} 
            setProfile={setProfile}
          />
          <LogoutButton onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}