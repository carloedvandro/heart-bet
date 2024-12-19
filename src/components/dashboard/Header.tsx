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
import { ThemeToggle } from "../theme/ThemeToggle";

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  const session = useSession();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
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
    <div className="relative z-50 opacity-85 bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-lg mb-6 border border-white/20">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col min-w-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Corações Premiados
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {displayName}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 py-1 h-auto flex items-center gap-1.5 hover:bg-opacity-90 transition-colors whitespace-nowrap ${
                  isProfileComplete
                    ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
                onClick={handleProfileClick}
              >
                {isProfileComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs">Cadastro completo</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs">Completar cadastro</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <BalanceDisplay profile={profile} />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AudioControl />
          <RechargeDialog 
            open={showRechargeDialog} 
            onOpenChange={setShowRechargeDialog}
            onRechargeCreated={() => {
              // Optionally handle recharge creation
              console.log('Recharge created');
            }}
          />
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