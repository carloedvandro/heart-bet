import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FinancialProfileDialog } from "./FinancialProfileDialog";
import { InvestmentTermsDialog } from "./InvestmentTermsDialog";
import { CreateInvestmentDialog } from "./CreateInvestmentDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvestmentStats } from "./InvestmentStats";
import { InvestmentCard } from "./InvestmentCard";
import { useInvestments } from "./hooks/useInvestments";

export function TradeCard() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

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
    handleCancelInvestment 
  } = useInvestments();

  const handleStartInvestment = () => {
    if (!financialProfile) {
      toast.info("Complete seu cadastro financeiro primeiro");
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

    const today = new Date();
    if (today.getDay() !== 5) {
      toast.error("Saques só podem ser solicitados às sextas-feiras");
      return;
    }

    setShowWithdrawDialog(true);
  };

  const isInvestmentEnabled = financialProfile && financialProfile.terms_accepted;

  return (
    <Card className="bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Investimento Trade</span>
          <div className="space-x-2">
            <Button 
              onClick={handleStartInvestment}
              disabled={!isInvestmentEnabled}
              title={!isInvestmentEnabled ? "Complete seu cadastro e aceite os termos primeiro" : ""}
            >
              Novo Investimento
            </Button>
            <Button 
              variant="outline" 
              onClick={handleWithdraw}
              disabled={!isInvestmentEnabled}
              title={!isInvestmentEnabled ? "Complete seu cadastro e aceite os termos primeiro" : ""}
            >
              Solicitar Saque
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InvestmentStats 
          totalInvested={totalInvested}
          totalEarnings={totalEarnings}
          isLoading={isLoadingInvestments}
        />

        {investments && investments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investimentos Ativos</h3>
            <div className="space-y-4">
              {investments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onCancelInvestment={handleCancelInvestment}
                />
              ))}
            </div>
          </div>
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
      />
      <WithdrawDialog 
        open={showWithdrawDialog} 
        onOpenChange={setShowWithdrawDialog} 
      />
    </Card>
  );
}