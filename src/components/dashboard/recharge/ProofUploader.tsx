import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";  // Re-add the import for Input
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

interface ProofUploaderProps {
  onProofUploaded?: () => void;
}

export function ProofUploader({ onProofUploaded }: ProofUploaderProps) {
  const session = useSession();
  const [uploadingProof, setUploadingProof] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Log session state on mount and when session changes
    console.log("Current session state:", {
      hasSession: !!session,
      userId: session?.user?.id
    });
  }, [session]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProof = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo");
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Por favor, envie apenas arquivos de imagem");
      return;
    }

    if (!session?.user?.id) {
      console.error("Tentativa de upload sem usuário autenticado");
      toast.error("Usuário não autenticado");
      return;
    }

    console.log("Iniciando upload com user ID:", session.user.id);
    setUploadingProof(true);

    try {
      // Create recharge record
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: session.user.id,
          amount: 0.01,
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      // Upload proof file
      const sanitizedFileName = selectedFile.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const filePath = `${recharge.id}-${sanitizedFileName}`;
      const arrayBuffer = await selectedFile.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, arrayBuffer, {
          contentType: selectedFile.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Create payment proof record
      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert({
          recharge_id: recharge.id,
          file_path: filePath,
        });

      if (proofError) throw proofError;

      // Generate payment link with proper logging
      console.log("Gerando link de pagamento para:", {
        userId: session.user.id,
        amount: 0.01
      });

      const response = await fetch(
        'https://mwdaxgwuztccxfgbusuj.supabase.co/functions/v1/generate-asaas-payment-link', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: session.user.id, 
            amount: 0.01 
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao gerar link de pagamento:', errorData);
        throw new Error('Falha ao gerar link de pagamento');
      }

      const data = await response.json();
      console.log('Link de pagamento gerado:', data.paymentUrl);

      toast.success("Comprovante enviado com sucesso!");
      onProofUploaded?.();
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error("Erro ao enviar comprovante");
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          id="proof"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploadingProof}
          className="hidden"
        />
        <Button
          variant="outline"
          className="w-full h-14 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:from-purple-900/30 dark:to-pink-900/30 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 dark:border-purple-700 group"
          onClick={() => document.getElementById('proof')?.click()}
          disabled={uploadingProof}
        >
          <Upload className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">
            {selectedFile ? selectedFile.name : "Envie teu comprovante"}
          </span>
        </Button>
      </div>

      {selectedFile && (
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300"
          onClick={handleUploadProof}
          disabled={uploadingProof}
        >
          {uploadingProof ? "Enviando..." : "Enviar comprovante"}
        </Button>
      )}

      <p className="text-sm text-muted-foreground text-center">
        Por favor, envie o comprovante do seu pagamento PIX.
      </p>
    </div>
  );
}