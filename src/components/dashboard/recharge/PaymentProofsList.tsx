import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ProofListItem } from "./proof-list/ProofListItem";
import { ProofImageDialog } from "./proof-list/ProofImageDialog";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: rechargeData, error: rechargeError } = await supabase
        .from('recharges')
        .select('id')
        .eq('user_id', user.id);

      if (rechargeError) throw rechargeError;

      const rechargeIds = rechargeData.map(recharge => recharge.id);

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
        
        const urls: Record<string, string> = {};
        for (const proof of proofData) {
          try {
            const { data: existsData, error: existsError } = await supabase.storage
              .from('payment_proofs')
              .list('', {
                search: proof.file_path
              });

            if (existsError) {
              console.error('Error checking file existence:', existsError);
              continue;
            }

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
                <ProofListItem
                  key={proof.id}
                  proof={proof}
                  imageUrl={proofUrls[proof.id]}
                  onImageClick={() => !failedImages.has(proof.id) && proofUrls[proof.id] && setSelectedImage(proofUrls[proof.id])}
                  hasImageError={failedImages.has(proof.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <ProofImageDialog
        imageUrl={selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      />
    </>
  );
}