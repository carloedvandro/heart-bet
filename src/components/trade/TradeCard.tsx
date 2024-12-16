import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { differenceInHours } from "date-fns";
import { FinancialProfileDialog } from "./FinancialProfileDialog";
import { InvestmentTermsDialog } from "./InvestmentTermsDialog";
import { CreateInvestmentDialog } from "./CreateInvestmentDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvestmentStats } from "./InvestmentStats";
import { ActiveInvestments } from "./ActiveInvestments";
import { playSounds } from "@/utils/soundEffects";

export function TradeCard() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
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

  // Fetch active investments
  const { data: investments, isLoading: isLoadingInvestments, refetch } = useQuery({
    queryKey: ['trade-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_investments')
        .select('*, trade_earnings(sum:amount)')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  const handleCancelInvestment = async (investmentId: string, createdAt: string) => {
    try {
      if (processingCancellation === investmentId) {
        return; // Prevent multiple cancellations
      }

      setProcessingCancellation(investmentId);
      
      const hoursSinceCreation = differenceInHours(new Date(), new Date(createdAt));
      
      if (hoursSinceCreation > 2) {
        playSounds.error();
        toast.error("Não é possível cancelar após 2 horas. Contate um administrador.");
        return;
      }

      const { error } = await supabase
        .from('trade_investments')
        .update({ status: 'cancelled' })
        .eq('id', investmentId);

      if (error) throw error;

      // Get investment details
      const { data: investment } = await supabase
        .from('trade_investments')
        .select('amount, user_id')
        .eq('id', investmentId)
        .single();

      if (investment) {
        const { data, error: balanceError } = await supabase
          .rpc('increment_balance', { amount: investment.amount });

        if (balanceError) throw balanceError;
      }

      playSounds.success();
      toast.success("Investimento cancelado com sucesso!");
      await refetch();
    } catch (error) {
      console.error('Erro ao cancelar investimento:', error);
      playSounds.error();
      toast.error("Erro ao cancelar investimento");
    } finally {
      setProcessingCancellation(null);
    }
  };

  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const totalEarnings = investments?.reduce((sum, inv) => sum + Number(inv.trade_earnings?.[0]?.sum || 0), 0) || 0;

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
    if (today.getDay() !== 5) { // 5 = Sexta-feira
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
          <ActiveInvestments 
            investments={investments}
            onCancelInvestment={handleCancelInvestment}
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
      />
      <WithdrawDialog 
        open={showWithdrawDialog} 
        onOpenChange={setShowWithdrawDialog} 
      />
    </Card>
  );
}