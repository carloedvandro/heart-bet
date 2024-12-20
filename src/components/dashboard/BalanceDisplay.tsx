import { Profile } from "@/integrations/supabase/custom-types";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 min-w-[150px] border border-green-200/50 shadow-sm">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
      <span className="font-bold text-green-600 whitespace-nowrap">
        R$ {profile?.balance?.toFixed(2) || '0.00'}
      </span>
    </div>
  );
}