import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { FinancialProfileForm, FormData } from "./FinancialProfileForm";
import { formatCPF, validateCPFFormat } from "@/utils/cpfUtils";

interface FinancialProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormData: FormData = {
  full_name: '',
  cpf: '',
  phone: '',
  pix_type: '',
  pix_key: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zip_code: '',
  birth_date: ''
};

export function FinancialProfileDialog({ open, onOpenChange }: FinancialProfileDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmit = async () => {
    if (!session?.user.id) {
      toast.error("Você precisa estar logado para continuar");
      return;
    }

    if (!validateCPFFormat(formData.cpf)) {
      toast.error("CPF inválido - deve conter 11 dígitos");
      return;
    }

    try {
      setLoading(true);
      
      const { error: insertError } = await supabase
        .from('financial_profiles')
        .insert({
          id: session.user.id,
          ...formData,
          cpf: formatCPF(formData.cpf) // Ensure CPF is formatted consistently
        });

      if (insertError) {
        if (insertError.code === '23505' && insertError.message?.includes('financial_profiles_cpf_key')) {
          toast.error("Este CPF já está cadastrado no sistema");
        } else {
          console.error('Error inserting profile:', insertError);
          toast.error("Erro ao cadastrar perfil financeiro");
        }
        return;
      }

      toast.success("Perfil financeiro cadastrado com sucesso!");
      onOpenChange(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao cadastrar perfil financeiro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro Financeiro</DialogTitle>
        </DialogHeader>
        <FinancialProfileForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}