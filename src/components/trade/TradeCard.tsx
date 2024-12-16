import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FinancialProfileDialog } from "./FinancialProfileDialog";
import { InvestmentTermsDialog } from "./InvestmentTermsDialog";
import { CreateInvestmentDialog } from "./CreateInvestmentDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function TradeCard() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['financial-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: investments, isLoading: isLoadingInvestments } = useQuery({
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

  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const totalEarnings = investments?.reduce((sum, inv) => sum + Number(inv.trade_earnings?.[0]?.sum || 0), 0) || 0;

  const handleStartInvestment = () => {
    if (!profile) {
      setShowProfileDialog(true);
    } else if (!profile.terms_accepted) {
      setShowTermsDialog(true);
    } else {
      setShowInvestDialog(true);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Investimento Trade</span>
          <Button onClick={handleStartInvestment}>
            Novo Investimento
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Investido</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvestments ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <span className="text-2xl font-bold">
                  R$ {totalInvested.toFixed(2)}
                </span>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvestments ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  R$ {totalEarnings.toFixed(2)}
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {investments && investments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investimentos Ativos</h3>
            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Investido em: {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                        <p className="font-semibold">
                          R$ {Number(investment.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          Rendimento: {investment.daily_rate}% ao dia
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowWithdrawDialog(true)}
                        disabled={new Date() < new Date(investment.locked_until)}
                      >
                        Solicitar Saque
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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