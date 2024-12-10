import { Profile } from "@/integrations/supabase/custom-types";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(profile?.balance || 0);

  return (
    <div className="bg-green-50 px-3 py-1.5 rounded-lg">
      <span className="text-green-800 font-medium whitespace-nowrap">
        Saldo: {formattedBalance}
      </span>
    </div>
  );
}