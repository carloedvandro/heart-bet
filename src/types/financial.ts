export interface FinancialProfile {
  id: string;
  terms_accepted: boolean;
  full_name?: string;  // Make these optional to handle existing profiles
  cpf?: string;
  // ... outros campos do perfil financeiro
}
