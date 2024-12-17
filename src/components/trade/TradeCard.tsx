import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { FinancialProfileDialog } from "./FinancialProfileDialog";
import { InvestmentTermsDialog } from "./InvestmentTermsDialog";
import { CreateInvestmentDialog } from "./CreateInvestmentDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvestmentStats } from "./InvestmentStats";
import { ActiveInvestments } from "./ActiveInvestments";
import { useInvestments } from "./hooks/useInvestments";
import { InvestmentRulesDialog } from "./InvestmentRulesDialog";
import { TradeCardHeader } from "./trade-card/TradeCardHeader";

export function TradeCard() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [processingCancellation, setProcessingCancellation] = useState<string | null>(null);

  const { data: financialProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['financial-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { 
    investments, 
    isLoading: isLoadingInvestments, 
    totalInvested,
    totalEarnings,
    handleCancelInvestment,
    refetchInvestments 
  } = useInvestments();

  const handleStartInvestment = () => {
    if (!financialProfile) {
      setShowProfileDialog(true);
      return;
    }

    if (!financialProfile.terms_accepted) {
      toast.info("Aceite os termos do investimento primeiro");
      setShowTermsDialog(true);
      return;
    }

    setShowInvestDialog(true);
  };

  const handleWithdraw = () => {
    if (!financialProfile) {
      toast.error("Complete seu cadastro financeiro primeiro");
      setShowProfileDialog(true);
      return;
    }

    if (!financialProfile.terms_accepted) {
      toast.error("Aceite os termos do investimento primeiro");
      setShowTermsDialog(true);
      return;
    }

    const today = new Date();
    if (today.getDay() !== 5) {
      toast.error("Saques só podem ser solicitados às sextas-feiras");
      return;
    }

    setShowWithdrawDialog(true);
  };

  const handleCancelInvestmentWithState = async (id: string) => {
    setProcessingCancellation(id);
    try {
      await handleCancelInvestment(id);
    } finally {
      setProcessingCancellation(null);
    }
  };

  return (
    <Card className="opacity-85 bg-white/90 backdrop-blur">
      <CardHeader>
        <TradeCardHeader 
          financialProfile={financialProfile}
          onStartInvestment={handleStartInvestment}
          onWithdraw={handleWithdraw}
          onShowRules={() => setShowRulesDialog(true)}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <InvestmentStats 
          totalInvested={totalInvested}
          totalEarnings={totalEarnings}
          isLoading={isLoadingInvestments}
        />

        {investments && investments.length > 0 && (
          <ActiveInvestments
            investments={investments}
            onCancelInvestment={handleCancelInvestmentWithState}
            processingCancellation={processingCancellation}
          />
        )}
      </CardContent>

      <FinancialProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
      <InvestmentTermsDialog 
        open={showTermsDialog} 
        onOpenChange={setShowTermsDialog} 
      />
      <CreateInvestmentDialog 
        open={showInvestDialog} 
        onOpenChange={setShowInvestDialog}
        onInvestmentCreated={refetchInvestments}
      />
      <WithdrawDialog 
        open={showWithdrawDialog} 
        onOpenChange={setShowWithdrawDialog} 
      />
      <InvestmentRulesDialog
        open={showRulesDialog}
        onOpenChange={setShowRulesDialog}
      />
    </Card>
  );
}