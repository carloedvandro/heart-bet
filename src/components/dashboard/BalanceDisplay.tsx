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
    <div className="bg-green-50 px-4 py-2 rounded-lg">
      <span className="text-green-800 font-medium">
        Saldo: {formattedBalance}
      </span>
    </div>
  );
}