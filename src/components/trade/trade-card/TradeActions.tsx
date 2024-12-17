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
  // Função para verificar se todos os campos obrigatórios estão preenchidos
  const isProfileComplete = (profile: FinancialProfile | null): boolean => {
    if (!profile) return false;
    
    const requiredFields = [
      'id',
      'full_name',
      'cpf',
      'phone',
      'pix_type',
      'pix_key',
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
      'zip_code',
      'birth_date'
    ];

    return requiredFields.every(field => Boolean(profile[field as keyof FinancialProfile]));
  };

  // Verificações de estado do perfil
  const profileComplete = isProfileComplete(financialProfile);
  const termsAccepted = Boolean(financialProfile?.terms_accepted);

  // Renderização condicional dos botões baseada no estado do perfil
  if (!profileComplete) {
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

  if (!termsAccepted) {
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