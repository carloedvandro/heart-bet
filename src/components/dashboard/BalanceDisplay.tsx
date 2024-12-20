import { Profile } from "@/integrations/supabase/custom-types";
import { useState } from "react";
import { WithdrawDialog } from "./WithdrawDialog";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowWithdrawDialog(true)}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 min-w-[150px] border border-green-200/50 shadow-sm hover:bg-green-500/20 transition-all cursor-pointer"
      >
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
        <span className="font-bold text-green-600 whitespace-nowrap">
          R$ {profile?.balance?.toFixed(2) || '0.00'}
        </span>
      </div>

      <WithdrawDialog 
        open={showWithdrawDialog} 
        onOpenChange={setShowWithdrawDialog}
      />
    </>
  );
}