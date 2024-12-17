import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { PixFields } from "./form/PixFields";
import { AddressFields } from "./form/AddressFields";

export interface FormData {
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
}

export interface FinancialProfileFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  loading: boolean;
  isEditMode?: boolean;
}

export function FinancialProfileForm({ 
  formData, 
  onChange, 
  onSubmit, 
  loading, 
  isEditMode 
}: FinancialProfileFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Dados Pessoais</h3>
          <PersonalInfoFields 
            formData={formData} 
            onChange={onChange}
            isEditMode={isEditMode}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">Dados do Pix</h3>
          <PixFields 
            formData={formData} 
            onChange={onChange} 
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">Endereço</h3>
          <AddressFields 
            formData={formData} 
            onChange={onChange} 
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : isEditMode ? "Atualizar Cadastro" : "Confirmar Cadastro"}
      </Button>
    </form>
  );
}