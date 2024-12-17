import { Button } from "@/components/ui/button";
import { FinancialProfile } from "@/types/financial";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TradeActionsProps {
  financialProfile: FinancialProfile | null;
  onStartInvestment: () => void;
  onWithdraw: () => void;
  onShowRules: () => void;
}

export function TradeActions({ 
  onStartInvestment, 
  onWithdraw,
  onShowRules 
}: TradeActionsProps) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['financial-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    staleTime: 0, // Desabilita o cache para sempre buscar dados frescos
    refetchInterval: 5000, // Refetch a cada 5 segundos
    refetchOnMount: true, // Refetch quando o componente montar
    refetchOnWindowFocus: true, // Refetch quando a janela ganhar foco
  });

  // Função para verificar se o perfil existe e está completo
  const isProfileComplete = (profile: FinancialProfile | null): boolean => {
    if (!profile) return false;
    if (!profile.cpf) return false;

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

    return requiredFields.every(field => {
      const value = profile[field as keyof FinancialProfile];
      return value !== null && value !== undefined && value !== '';
    });
  };

  // Verificações de estado do perfil
  const profileComplete = isProfileComplete(profile);
  const termsAccepted = Boolean(profile?.terms_accepted);

  // Log para debug
  console.log('Profile status:', {
    profile,
    profileComplete,
    termsAccepted,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Button disabled>Carregando...</Button>
      </div>
    );
  }

  // Se o perfil não estiver completo, mostra botão de completar cadastro
  if (!profileComplete) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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