import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FinancialProfile } from "@/types/financial";

interface TradeActionsProps {
  financialProfile: FinancialProfile | null;
  onStartInvestment: () => void;
  onWithdraw: () => void;
  onShowRules: () => void;
}

export function TradeActions({ 
  financialProfile, 
  onStartInvestment, 
  onWithdraw,
  onShowRules 
}: TradeActionsProps) {
  const isInvestmentEnabled = financialProfile && financialProfile.terms_accepted;

  if (!financialProfile) {
    return (
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Button 
          onClick={onStartInvestment} 
          variant="default"
          className="w-full sm:w-auto"
        >
          Completar Cadastro
        </Button>
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Para investir no mercado trade, complete seu cadastro financeiro
        </p>
      </div>
    );
  }

  if (!financialProfile.terms_accepted) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          onClick={onStartInvestment} 
          variant="default"
          className="w-full sm:w-auto"
        >
          Aceitar Termos
        </Button>
        <Button
          onClick={onShowRules}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Ler Regras
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button 
        onClick={onStartInvestment}
        className="w-full sm:w-auto"
      >
        Novo Investimento
      </Button>
      <Button 
        variant="outline" 
        onClick={onWithdraw}
        className="w-full sm:w-auto"
      >
        Solicitar Saque
      </Button>
      <Button
        onClick={onShowRules}
        variant="outline"
        className="w-full sm:w-auto"
      >
        Ler Regras
      </Button>
    </div>
  );
}