export interface FinancialProfile {
  id: string;
  full_name: string;
  cpf: string;
  phone: string;
  pix_type: string;
  pix_key: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  birth_date: string;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  created_at?: string;
}