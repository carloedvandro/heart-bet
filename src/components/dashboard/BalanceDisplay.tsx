import { Profile } from "@/integrations/supabase/custom-types";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  console.log("BalanceDisplay - Profile:", profile);
  
  // Garante que o balance seja sempre um número
  const balanceValue = profile?.balance ? parseFloat(profile.balance.toString()) : 0;
  console.log("BalanceDisplay - Balance value:", balanceValue);
  
  return (
    <div className="bg-green-50 px-4 py-2 rounded-lg flex items-center space-x-2 min-w-[150px] border border-green-200">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
      <span className="font-bold text-green-600 whitespace-nowrap">
        R$ {balanceValue.toFixed(2)}
      </span>
    </div>
  );
}