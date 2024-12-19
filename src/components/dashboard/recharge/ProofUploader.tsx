import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface ProofUploaderProps {
  onProofUploaded: () => void;
}

export function ProofUploader({ onProofUploaded }: ProofUploaderProps) {
  const [uploadingProof, setUploadingProof] = useState(false);

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    
    // Verificar se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, envie apenas arquivos de imagem (JPG, PNG, etc)");
      return;
    }

    try {
      setUploadingProof(true);
      
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: 0.01, // Set a minimal positive amount to satisfy the check constraint
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!fileExt || !validExtensions.includes(fileExt)) {
        throw new Error('Formato de arquivo inválido. Use JPG, PNG, GIF ou WebP.');
      }

      const filePath = `${recharge.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type // Definir explicitamente o content-type
        });

      if (uploadError) throw uploadError;

      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert({
          recharge_id: recharge.id,
          file_path: filePath,
        });

      if (proofError) throw proofError;

      toast.success("Comprovante enviado com sucesso!");
      onProofUploaded();
      
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao enviar comprovante");
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
      <Label htmlFor="proof">Enviar Comprovante</Label>
      <Input
        id="proof"
        type="file"
        accept="image/*" // Aceitar apenas imagens
        onChange={handleUploadProof}
        disabled={uploadingProof}
        className="cursor-pointer"
      />
      <p className="text-sm text-muted-foreground">
        Por favor, envie o comprovante do seu pagamento PIX em formato de imagem (JPG, PNG, GIF ou WebP).
      </p>
    </div>
  );
}