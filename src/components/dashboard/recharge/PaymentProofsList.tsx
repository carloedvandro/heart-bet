import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface PaymentProof {
  id: string;
  recharge_id: string;
  file_path: string;
  status: string;
  created_at: string;
}

export function PaymentProofsList() {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [loadingProof, setLoadingProof] = useState(false);
  const [loadingProofId, setLoadingProofId] = useState<string | null>(null);

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const { data: proofData, error } = await supabase
        .from('payment_proofs')
        .select(`
          id,
          recharge_id,
          file_path,
          status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProofs(proofData || []);
    } catch (error) {
      console.error('Error fetching proofs:', error);
      toast.error('Erro ao carregar comprovantes');
    } finally {
      setLoading(false);
    }
  };

  const viewProof = async (proof: PaymentProof) => {
    try {
      setLoadingProofId(proof.id);
      setLoadingProof(true);
      setSelectedProofUrl(null);

      // Tentar obter URL pública com timestamp para evitar cache
      const timestamp = new Date().getTime();
      const { data: publicUrlData } = await supabase.storage
        .from('payment_proofs')
        .getPublicUrl(`${proof.file_path}?t=${timestamp}`);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Falha ao gerar URL pública');
      }

      // Verificar se a imagem pode ser carregada antes de exibir
      const img = new Image();
      img.onerror = () => {
        throw new Error('Falha ao carregar imagem da URL pública');
      };

      const loadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = publicUrlData.publicUrl;
      });

      await loadPromise;
      setSelectedProofUrl(publicUrlData.publicUrl);

    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      
      try {
        // Tentar URL assinada como fallback
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('payment_proofs')
          .createSignedUrl(proof.file_path, 900); // 15 minutos

        if (signedUrlError || !signedUrlData?.signedUrl) {
          throw new Error('Falha ao gerar URL assinada');
        }

        // Verificar se a imagem pode ser carregada da URL assinada
        const img = new Image();
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = signedUrlData.signedUrl;
        });

        await loadPromise;
        setSelectedProofUrl(signedUrlData.signedUrl);

      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        toast.error('Não foi possível carregar o comprovante. Por favor, atualize a página e tente novamente.');
        setSelectedProofUrl(null);
      }
    } finally {
      setLoadingProof(false);
      setLoadingProofId(null);
    }
  };

  const handleImageError = () => {
    toast.error('Erro ao carregar imagem. Por favor, atualize a página e tente novamente.');
    setSelectedProofUrl(null);
  };

  if (loading) return <div>Carregando comprovantes...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Seus Comprovantes</h3>
      
      {proofs.length === 0 ? (
        <p className="text-muted-foreground">Nenhum comprovante enviado ainda.</p>
      ) : (
        <div className="grid gap-4">
          {proofs.map((proof) => (
            <div
              key={proof.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  Comprovante #{proof.id.slice(0, 8)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Enviado em: {format(new Date(proof.created_at), 'dd/MM/yyyy HH:mm')}
                </p>
                <p className="text-sm">
                  Status: {proof.status === 'pending' ? 'Pendente' : 'Aprovado'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewProof(proof)}
                disabled={loadingProof && loadingProofId === proof.id}
              >
                <Eye className="h-4 w-4 mr-2" />
                {loadingProof && loadingProofId === proof.id ? 'Carregando...' : 'Visualizar'}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedProofUrl} onOpenChange={() => setSelectedProofUrl(null)}>
        <DialogContent className="max-w-3xl">
          <ScrollArea className="max-h-[80vh]">
            {selectedProofUrl && (
              <img
                src={selectedProofUrl}
                alt="Comprovante de pagamento"
                className="w-full h-auto"
                onError={handleImageError}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}