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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      // Primeiro, obter o ID do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Primeiro, buscar os IDs das recargas do usuário
      const { data: rechargeData, error: rechargeError } = await supabase
        .from('recharges')
        .select('id')
        .eq('user_id', user.id);

      if (rechargeError) throw rechargeError;

      const rechargeIds = rechargeData.map(recharge => recharge.id);

      // Agora buscar os comprovantes usando os IDs das recargas
      const { data: proofData, error } = await supabase
        .from('payment_proofs')
        .select(`
          id,
          recharge_id,
          file_path,
          status,
          created_at
        `)
        .in('recharge_id', rechargeIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (proofData) {
        setProofs(proofData);
        
        // Buscar URLs públicas para todas as provas
        const urls: Record<string, string> = {};
        for (const proof of proofData) {
          try {
            // Primeiro verificar se o arquivo existe
            const { data: existsData, error: existsError } = await supabase.storage
              .from('payment_proofs')
              .list('', {
                search: proof.file_path
              });

            if (existsError) {
              console.error('Error checking file existence:', existsError);
              continue;
            }

            // Se o arquivo não existe, pular para o próximo
            if (!existsData || existsData.length === 0) {
              console.warn(`File ${proof.file_path} not found in storage`);
              setFailedImages(prev => new Set([...prev, proof.id]));
              continue;
            }

            const { data, error: urlError } = await supabase.storage
              .from('payment_proofs')
              .createSignedUrl(proof.file_path, 3600);

            if (urlError) {
              console.error('Error getting signed URL:', urlError);
              continue;
            }

            if (data?.signedUrl) {
              urls[proof.id] = data.signedUrl;
            }
          } catch (err) {
            console.error(`Error processing proof ${proof.id}:`, err);
          }
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

  const handleImageError = (proofId: string) => {
    setFailedImages(prev => new Set([...prev, proofId]));
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
                    onClick={() => !failedImages.has(proof.id) && proofUrls[proof.id] && setSelectedImage(proofUrls[proof.id])}
                  >
                    {!failedImages.has(proof.id) && proofUrls[proof.id] ? (
                      <AvatarImage
                        src={proofUrls[proof.id]}
                        alt="Comprovante"
                        className="object-cover"
                        onError={() => handleImageError(proof.id)}
                      />
                    ) : (
                      <AvatarFallback className="bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </AvatarFallback>
                    )}
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
                    {failedImages.has(proof.id) && (
                      <p className="text-sm text-red-500">
                        Imagem indisponível
                      </p>
                    )}
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