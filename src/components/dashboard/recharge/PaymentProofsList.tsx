import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      
      console.log('Fetched proofs:', proofData);
      
      if (proofData) {
        setProofs(proofData);
        
        // Buscar URLs públicas para todas as provas
        const urls: Record<string, string> = {};
        for (const proof of proofData) {
          const { data: { publicUrl } } = supabase.storage
            .from('payment_proofs')
            .getPublicUrl(proof.file_path);
          
          console.log(`URL for proof ${proof.id}:`, publicUrl);
          urls[proof.id] = publicUrl;
        }
        setProofUrls(urls);
      }
    } catch (error) {
      console.error('Error fetching proofs:', error);
      toast.error('Erro ao carregar comprovantes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando comprovantes...</div>;

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Seus Comprovantes</h3>
        
        {proofs.length === 0 ? (
          <p className="text-muted-foreground">Nenhum comprovante enviado ainda.</p>
        ) : (
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="grid gap-4">
              {proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Avatar 
                    className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(proofUrls[proof.id])}
                  >
                    <AvatarImage
                      src={proofUrls[proof.id]}
                      alt="Comprovante"
                      className="object-cover"
                      onError={(e) => {
                        console.error('Error loading image:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Comprovante #{proof.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enviado em: {format(new Date(proof.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                    <p className="text-sm">
                      Status: {proof.status === 'pending' ? 'Pendente' : 'Aprovado'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Comprovante"
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '80vh' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}