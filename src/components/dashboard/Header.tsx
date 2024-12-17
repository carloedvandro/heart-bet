import { Profile } from "@/integrations/supabase/custom-types";
import { BalanceDisplay } from "./BalanceDisplay";
import { RechargeDialog } from "./RechargeDialog";
import { AudioControl } from "./AudioControl";
import { LogoutButton } from "./LogoutButton";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { FinancialProfileDialog } from "../trade/FinancialProfileDialog";

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  const session = useSession();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const displayName = session?.user?.email || 'Usuário';

  const { data: financialProfile } = useQuery({
    queryKey: ['financial-profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', session?.user?.id);

      if (error && !error.message.includes('no rows')) {
        console.error('Error fetching financial profile:', error);
        return null;
      }
      
      return data?.[0] || null;
    },
    enabled: !!session?.user?.id,
  });

  const isProfileComplete = !!financialProfile;

  const handleProfileClick = () => {
    setShowProfileDialog(true);
  };

  return (
    <div className="relative z-50 bg-white/60 backdrop-blur-sm supports-[backdrop-filter]:bg-white/40 rounded-lg p-4 shadow-lg mb-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                Corações Premiados
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 -mt-1">
                  {displayName}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 py-1 h-auto flex items-center gap-1.5 -mt-1 hover:bg-opacity-90 transition-colors ${
                    isProfileComplete
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                  onClick={handleProfileClick}
                >
                  {isProfileComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Cadastro completo</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span className="text-xs">Completar cadastro</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <BalanceDisplay profile={profile} />
        </div>
        <div className="flex items-center gap-4">
          <AudioControl />
          <RechargeDialog />
          <LogoutButton onLogout={onLogout} />
        </div>
      </div>

      <FinancialProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
        existingProfile={financialProfile}
      />
    </div>
  );
}
