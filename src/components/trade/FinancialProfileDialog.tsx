import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { FinancialProfileForm, FormData } from "./financial-profile/FinancialProfileForm";
import { useQueryClient } from "@tanstack/react-query";

interface FinancialProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingProfile?: FormData | null;
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

export function FinancialProfileDialog({ open, onOpenChange, existingProfile }: FinancialProfileDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const queryClient = useQueryClient();
  const isEditMode = !!existingProfile;

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    } else {
      setFormData(initialFormData);
    }
  }, [existingProfile]);

  const handleSubmit = async () => {
    if (!session?.user.id) {
      toast.error("Você precisa estar logado para continuar");
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting form data:', formData); // Debug log
      
      if (isEditMode) {
        const { error } = await supabase
          .from('financial_profiles')
          .update({
            full_name: formData.full_name,
            cpf: formData.cpf,
            phone: formData.phone,
            pix_type: formData.pix_type,
            pix_key: formData.pix_key,
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            birth_date: formData.birth_date
          })
          .eq('id', session.user.id);

        if (error) {
          console.error('Update error:', error); // Debug log
          throw error;
        }
        
        toast.success("Perfil financeiro atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('financial_profiles')
          .insert({
            id: session.user.id,
            ...formData
          });

        if (error) {
          if (error.code === '23505' && error.message?.includes('financial_profiles_cpf_key')) {
            toast.error("Este CPF já está cadastrado no sistema");
            return;
          }
          throw error;
        }

        toast.success("Perfil financeiro cadastrado com sucesso!");
      }

      queryClient.invalidateQueries({ queryKey: ['financial-profile'] });
      onOpenChange(false);
      if (!isEditMode) {
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(isEditMode ? "Erro ao atualizar perfil financeiro" : "Erro ao cadastrar perfil financeiro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Cadastro Financeiro' : 'Cadastro Financeiro'}
          </DialogTitle>
        </DialogHeader>
        <FinancialProfileForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}