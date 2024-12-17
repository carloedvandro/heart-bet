import { Button } from "@/components/ui/button";
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
  // Verificar se o perfil financeiro existe e tem os campos obrigatórios preenchidos
  const hasCompleteProfile = Boolean(
    financialProfile?.id &&
    financialProfile?.full_name && 
    financialProfile?.cpf
  );

  // Verificar se aceitou os termos
  const hasAcceptedTerms = Boolean(financialProfile?.terms_accepted);

  // Se não houver perfil financeiro ou estiver incompleto, mostra botão de completar cadastro
  if (!hasCompleteProfile) {
    return (
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Button 
          onClick={onStartInvestment} 
          variant="default"
          className="w-full sm:w-auto"
        >
          Completar Cadastro
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

  // Se tiver perfil mas não aceitou os termos, mostra apenas botões de aceitar termos e ler regras
  if (!hasAcceptedTerms) {
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

  // Se tiver perfil completo E aceitou os termos, mostra todos os botões
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