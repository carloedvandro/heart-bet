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
  // Função para verificar se o perfil existe e está completo
  const isProfileComplete = (profile: FinancialProfile | null): boolean => {
    // Se não houver perfil, retorna falso
    if (!profile) return false;
    
    // Se o perfil existe mas não tem CPF, considera incompleto
    if (!profile.cpf) return false;

    // Lista de campos obrigatórios
    const requiredFields = [
      'full_name',
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

    // Verifica se todos os campos obrigatórios estão preenchidos
    return requiredFields.every(field => {
      const value = profile[field as keyof FinancialProfile];
      return value !== null && value !== undefined && value !== '';
    });
  };

  // Verificações de estado do perfil
  const profileComplete = isProfileComplete(financialProfile);
  const termsAccepted = Boolean(financialProfile?.terms_accepted);

  // Log para debug
  console.log('Profile status:', {
    financialProfile,
    profileComplete,
    termsAccepted
  });

  // Se o perfil não estiver completo, mostra botão de completar cadastro
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

  // Se não aceitou os termos, mostra botão de aceitar termos
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

  // Se o perfil estiver completo e os termos aceitos, mostra todos os botões
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