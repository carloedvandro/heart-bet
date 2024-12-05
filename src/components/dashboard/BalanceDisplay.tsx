import { Profile } from "@/integrations/supabase/custom-types";
import { useState } from "react";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile: initialProfile }: BalanceDisplayProps) {
  const [profile] = useState<Profile | null>(initialProfile);

  return (
    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center space-x-2 min-w-[150px]">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
      <span className="font-bold text-green-600 whitespace-nowrap">
        R$ {profile?.balance?.toFixed(2) || '0.00'}
      </span>
    </div>
  );
}