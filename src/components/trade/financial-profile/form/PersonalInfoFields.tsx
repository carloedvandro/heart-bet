import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "../FinancialProfileForm";
import { formatCPF } from "@/utils/cpfUtils";

interface PersonalInfoFieldsProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  isEditMode?: boolean;
}

export function PersonalInfoFields({ formData, onChange, isEditMode }: PersonalInfoFieldsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'cpf') {
      processedValue = formatCPF(value);
    }
    
    onChange({
      ...formData,
      [name]: processedValue
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nome Completo</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required
          maxLength={11}
          disabled={isEditMode}
          className={isEditMode ? "bg-gray-100" : ""}
        />
      </div>

      <div>
        <Label htmlFor="phone">WhatsApp/Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="birth_date">Data de Nascimento</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}