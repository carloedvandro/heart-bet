import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCPF } from "@/utils/cpfUtils";

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
}

export function FinancialProfileForm({ formData, onChange, onSubmit, loading }: FinancialProfileFormProps) {
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
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zip_code">CEP</Label>
        <Input
          id="zip_code"
          name="zip_code"
          value={formData.zip_code}
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cadastrando..." : "Confirmar Cadastro"}
      </Button>
    </form>
  );
}
