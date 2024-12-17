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
import { ActiveInvestments } from "./ActiveInvestments";
import { useInvestments } from "./hooks/useInvestments";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleCancelInvestmentWithState = async (id: string, createdAt: string) => {
    setProcessingCancellation(id);
    try {
      await handleCancelInvestment(id);
    } finally {
      setProcessingCancellation(null);
    }
  };

  const isInvestmentEnabled = financialProfile && financialProfile.terms_accepted;

  return (
    <Card className="bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span>Investimento Trade</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!financialProfile ? (
              <Button 
                onClick={() => setShowProfileDialog(true)} 
                variant="default"
                className="w-full sm:w-auto"
              >
                Completar Cadastro
              </Button>
            ) : !financialProfile.terms_accepted ? (
              <Button 
                onClick={() => setShowTermsDialog(true)} 
                variant="default"
                className="w-full sm:w-auto"
              >
                Aceitar Termos
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full sm:w-auto">
                        <Button 
                          onClick={handleStartInvestment}
                          disabled={!isInvestmentEnabled}
                          className="w-full"
                        >
                          Novo Investimento
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isInvestmentEnabled && (
                      <TooltipContent>
                        <p>Complete seu cadastro e aceite os termos primeiro</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          onClick={handleWithdraw}
                          disabled={!isInvestmentEnabled}
                          className="w-full"
                        >
                          Solicitar Saque
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isInvestmentEnabled && (
                      <TooltipContent>
                        <p>Complete seu cadastro e aceite os termos primeiro</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
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
    </Card>
  );
}