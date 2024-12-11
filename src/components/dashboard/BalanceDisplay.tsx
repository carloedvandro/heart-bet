import { Profile } from "@/integrations/supabase/custom-types";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  // Add detailed logging to track the profile and balance values
  console.log("BalanceDisplay - Profile:", profile);
  console.log("BalanceDisplay - Balance value:", profile?.balance);
  
  // Ensure we handle undefined/null values properly and convert to number
  const balanceValue = typeof profile?.balance === 'number' ? profile.balance : 
                      typeof profile?.balance === 'string' ? parseFloat(profile.balance) : 0;
  
  return (
    <div className="bg-green-50 px-4 py-2 rounded-lg flex items-center space-x-2 min-w-[150px] border border-green-200">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
      <span className="font-bold text-green-600 whitespace-nowrap">
        R$ {balanceValue.toFixed(2)}
      </span>
    </div>
  );
}