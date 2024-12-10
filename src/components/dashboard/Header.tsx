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
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Corações Premiados
          </h1>
          <div className="flex items-center gap-4">
            <AudioControl />
            <RechargeDialog />
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <BalanceDisplay profile={profile} />
          <ProfileActions 
            isAdmin={profile?.is_admin ?? false} 
            setProfile={setProfile}
          />
        </div>
      </div>
    </div>
  );
}