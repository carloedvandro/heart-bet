import { Profile } from "@/integrations/supabase/custom-types"
import { RechargeDialog } from "./RechargeDialog"
import { BalanceDisplay } from "./BalanceDisplay"
import { LogoutButton } from "./LogoutButton"
import { AudioControl } from "./AudioControl"
import { DollarValueButton } from "./DollarValueButton"

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <AudioControl />
        <DollarValueButton />
      </div>
      <div className="flex items-center gap-4">
        <BalanceDisplay profile={profile} />
        <RechargeDialog />
        <LogoutButton onLogout={onLogout} />
      </div>
    </header>
  )
}