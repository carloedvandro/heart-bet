import { Profile } from "@/integrations/supabase/custom-types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface BalanceDisplayProps {
  profile: Profile | null;
}

export function BalanceDisplay({ profile: initialProfile }: BalanceDisplayProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const session = useSession();

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase.channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Profile update received:', payload);
          if (payload.new) {
            setProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return (
    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center space-x-2 min-w-[150px]">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Saldo:</span>
      <span className="font-bold text-green-600 whitespace-nowrap">
        R$ {profile?.balance?.toFixed(2) || '0.00'}
      </span>
    </div>
  );
}