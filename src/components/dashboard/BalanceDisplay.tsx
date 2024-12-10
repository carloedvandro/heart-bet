import { Profile } from "@/integrations/supabase/custom-types";
import { Card } from "@/components/ui/card";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile }: BalanceDisplayProps) {
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(profile?.balance || 0);

  return (
    <Card className="bg-green-50 border-green-100 px-6 py-3">
      <span className="text-green-800 font-medium text-lg">
        Saldo: {formattedBalance}
      </span>
    </Card>
  );
}