import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface InvestmentTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestmentTermsDialog({ open, onOpenChange }: InvestmentTermsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();

  const handleAcceptTerms = async () => {
    if (!session?.user.id) {
      toast.error("Você precisa estar logado para continuar");
      return;
    }

    if (!accepted) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('financial_profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success("Termos aceitos com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['financial-profile'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao aceitar os termos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Termos de Investimento</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Introdução</h3>
            <p>
              Este documento estabelece os termos e condições para investimentos em nossa plataforma.
              Ao aceitar estes termos, você confirma que leu, entendeu e concorda com todas as condições aqui estabelecidas.
            </p>

            <h3 className="text-lg font-semibold">2. Riscos do Investimento</h3>
            <p>
              Todo investimento envolve riscos, e o investidor deve estar ciente de que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Os retornos passados não garantem retornos futuros</li>
              <li>O capital investido não possui garantia</li>
              <li>As operações podem resultar em perdas patrimoniais</li>
            </ul>

            <h3 className="text-lg font-semibold">3. Responsabilidades</h3>
            <p>
              O investidor é responsável por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter seus dados cadastrais atualizados</li>
              <li>Cumprir com as obrigações fiscais relacionadas aos investimentos</li>
            </ul>

            <h3 className="text-lg font-semibold">4. Taxas e Custos</h3>
            <p>
              O investidor está ciente das seguintes taxas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Taxa de administração: conforme especificado no momento do investimento</li>
              <li>Taxa de performance: quando aplicável, conforme especificado no investimento</li>
              <li>Custos operacionais: conforme detalhado na proposta de investimento</li>
            </ul>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
          />
          <Label htmlFor="terms">
            Li e aceito os termos de investimento
          </Label>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAcceptTerms} disabled={loading || !accepted}>
            {loading ? "Processando..." : "Aceitar Termos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}