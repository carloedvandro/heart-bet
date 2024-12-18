import { RechargeDialog } from "./RechargeDialog"
import { BalanceDisplay } from "./BalanceDisplay"
import { LogoutButton } from "./LogoutButton"
import { AudioControl } from "./AudioControl"
import { DollarValueButton } from "./DollarValueButton"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <AudioControl />
        <DollarValueButton />
      </div>
      <div className="flex items-center gap-4">
        <BalanceDisplay />
        <RechargeDialog />
        <LogoutButton />
      </div>
    </header>
  )
}