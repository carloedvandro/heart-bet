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
    
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, envie apenas arquivos de imagem");
      return;
    }

    try {
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: 0.01,
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      // Sanitize filename by removing special characters and spaces
      const sanitizedFileName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const filePath = `${recharge.id}-${sanitizedFileName}`;

      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: false
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
      onProofUploaded?.();
      
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error("Erro ao enviar comprovante");
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        id="proof"
        type="file"
        accept="image/*"
        onChange={handleUploadProof}
        disabled={uploadingProof}
        className="cursor-pointer bg-white/50 border-purple-200 file:bg-purple-500 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 hover:file:bg-purple-600 transition-colors"
      />
      <p className="text-sm text-purple-600">
        Por favor, envie o comprovante do seu pagamento PIX.
      </p>
    </div>
  );
}