import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface InvestmentTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestmentTermsDialog({ open, onOpenChange }: InvestmentTermsDialogProps) {
  const session = useSession();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcceptTerms = async () => {
    if (!session?.user.id) return;

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Termos do Investimento Trade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>O investimento trade apresenta os seguintes termos:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Rendimentos de 0,5% ao dia para valores mantidos por 7 a 29 dias.</li>
              <li>Rendimentos de 1% ao dia para valores mantidos por 30 dias ou mais.</li>
              <li>Período mínimo de bloqueio do saldo investido (7 ou 30 dias).</li>
              <li>Taxa de 5% sobre o valor do saque.</li>
              <li>O valor sacado será transferido apenas para contas vinculadas ao CPF cadastrado.</li>
              <li>A empresa pode alterar ou retirar o investimento trade sem aviso prévio.</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md text-sm">
            <p className="font-semibold text-yellow-800">Avisos importantes:</p>
            <ul className="list-disc pl-4 space-y-1 text-yellow-700">
              <li>O mercado de investimentos apresenta riscos, incluindo a possibilidade de perda parcial ou total do valor investido.</li>
              <li>Rendimentos passados não garantem resultados futuros.</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              Li e estou ciente do risco do mercado trade e estou de total acordo com os termos.
            </Label>
          </div>

          <Button
            onClick={handleAcceptTerms}
            disabled={!accepted || loading}
            className="w-full"
          >
            {loading ? "Processando..." : "Aceitar e Continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}