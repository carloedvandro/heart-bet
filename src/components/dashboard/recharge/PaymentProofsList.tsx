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
      setSelectedProofUrl(null); // Reset previous URL

      // First try to get a public URL
      const { data: publicUrlData } = await supabase.storage
        .from('payment_proofs')
        .getPublicUrl(proof.file_path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Erro ao gerar URL pública');
      }

      // Add timestamp to prevent caching
      const url = new URL(publicUrlData.publicUrl);
      url.searchParams.append('t', Date.now().toString());
      
      setSelectedProofUrl(url.toString());
    } catch (error) {
      console.error('Error getting proof URL:', error);
      
      // If public URL fails, try signed URL as fallback
      try {
        const { data: signedUrlData } = await supabase.storage
          .from('payment_proofs')
          .createSignedUrl(proof.file_path, 600); // 10 minutes expiry

        if (!signedUrlData?.signedUrl) {
          throw new Error('Erro ao gerar URL assinada');
        }

        setSelectedProofUrl(signedUrlData.signedUrl);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Não foi possível carregar o comprovante. Por favor, tente novamente em alguns instantes.');
      }
    } finally {
      setLoadingProof(false);
      setLoadingProofId(null);
    }
  };

  const handleImageError = () => {
    toast.error('Não foi possível carregar a imagem. Por favor, tente visualizar novamente.');
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