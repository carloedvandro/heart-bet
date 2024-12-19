import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    } finally {
      setLoading(false);
    }
  };

  const viewProof = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('payment_proofs')
        .createSignedUrl(filePath, 60); // URL válida por 60 segundos

      if (data?.signedUrl) {
        setSelectedProofUrl(data.signedUrl);
      }
    } catch (error) {
      console.error('Error getting proof URL:', error);
    }
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
                onClick={() => viewProof(proof.file_path)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
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
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}