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
    
    try {
      setUploadingProof(true);
      const file = e.target.files[0];
      
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: 0.01, // Set a minimal positive amount to satisfy the check constraint
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${recharge.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file, {
          upsert: true
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
      toast.error("Erro ao enviar comprovante");
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
        accept="image/*,.pdf"
        onChange={handleUploadProof}
        disabled={uploadingProof}
        className="cursor-pointer"
      />
      <p className="text-sm text-muted-foreground">
        Por favor, envie o comprovante do seu pagamento PIX para confirmar a recarga.
      </p>
    </div>
  );
}