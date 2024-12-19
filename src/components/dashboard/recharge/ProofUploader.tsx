import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProofUploaderProps {
  onProofUploaded?: () => void;
}

export function ProofUploader({ onProofUploaded }: ProofUploaderProps) {
  const [uploadingProof, setUploadingProof] = useState(false);

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploadingProof(true);
    const file = e.target.files[0];
    
    // Verificação simples se é uma imagem
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, envie apenas arquivos de imagem");
      return;
    }

    try {
      // Criar registro de recarga primeiro
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: 0.01,
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      // Usar o nome original do arquivo
      const filePath = `${recharge.id}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Criar registro do comprovante
      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert({
          recharge_id: recharge.id,
          file_path: filePath,
        });

      if (proofError) throw proofError;

      toast.success("Comprovante enviado com sucesso!");
      onProofUploaded?.();
      
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error("Erro ao enviar comprovante");
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        id="proof"
        type="file"
        accept="image/*"
        onChange={handleUploadProof}
        disabled={uploadingProof}
        className="cursor-pointer"
      />
      <p className="text-sm text-muted-foreground">
        Por favor, envie o comprovante do seu pagamento PIX.
      </p>
    </div>
  );
}