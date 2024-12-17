import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "../FinancialProfileForm";

interface PixFieldsProps {
  formData: FormData;
  onChange: (data: FormData) => void;
}

export function PixFields({ formData, onChange }: PixFieldsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pix_type">Tipo de Pix</Label>
        <Select
          value={formData.pix_type}
          onValueChange={(value) => onChange({ ...formData, pix_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de Pix" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpf">CPF</SelectItem>
            <SelectItem value="cnpj">CNPJ</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Telefone</SelectItem>
            <SelectItem value="random">Chave Aleatória</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pix_key">Chave Pix</Label>
        <Input
          id="pix_key"
          name="pix_key"
          value={formData.pix_key}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}