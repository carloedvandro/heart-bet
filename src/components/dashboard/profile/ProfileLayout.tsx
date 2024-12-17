import { Profile } from "@/integrations/supabase/custom-types";
import { FinancialProfileDialog } from "@/components/trade/financial-profile/FinancialProfileDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Wallet } from "lucide-react";
import { BalanceDisplay } from "../BalanceDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileLayoutProps {
  profile: Profile | null;
}

export function ProfileLayout({ profile }: ProfileLayoutProps) {
  const [showFinancialProfile, setShowFinancialProfile] = useState(false);

  // Fetch financial profile data
  const { data: financialProfile } = useQuery({
    queryKey: ['financial-profile'],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id
  });

  return (
    <div className="space-y-6 p-4">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserRound className="h-6 w-6" />
            Perfil do Usuário
          </CardTitle>
          <BalanceDisplay profile={profile} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg font-medium">{profile?.email || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Dados Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowFinancialProfile(true)}
            className="w-full"
          >
            {financialProfile ? 'Editar Dados Financeiros' : 'Gerenciar Dados Financeiros'}
          </Button>
        </CardContent>
      </Card>

      <FinancialProfileDialog
        open={showFinancialProfile}
        onOpenChange={setShowFinancialProfile}
        existingProfile={financialProfile}
      />
    </div>
  );
}