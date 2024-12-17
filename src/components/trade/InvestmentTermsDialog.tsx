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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
          <DialogTitle className="text-2xl font-bold">Termos de Investimento Trade</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] rounded-md border p-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Rendimentos</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-lg">
                  <span className="font-semibold text-primary">0,5% ao dia</span> para valores mantidos de 7 a 29 dias
                </li>
                <li className="text-lg">
                  <span className="font-semibold text-primary">1% ao dia</span> para valores mantidos por 30 dias ou mais
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Período de Bloqueio</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-lg">Mínimo: <span className="font-semibold">7 dias</span></li>
                <li className="text-lg">Recomendado: <span className="font-semibold">30 dias ou mais</span></li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Condições de Saque</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-lg">Taxa de saque: <span className="font-semibold text-primary">5% sobre o valor retirado</span></li>
                <li className="text-lg">Solicitações permitidas apenas às <span className="font-semibold">sextas-feiras</span></li>
                <li className="text-lg">Pagamento realizado até a terça-feira seguinte</li>
                <li className="text-lg">Transferências exclusivamente para contas vinculadas ao CPF cadastrado</li>
              </ul>
            </section>

            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="ml-2">
                <p className="font-semibold text-lg">AVISO DE RISCO</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>O mercado de investimentos apresenta riscos, incluindo a possibilidade de perda parcial ou total do valor investido.</li>
                  <li>Rendimentos passados não garantem resultados futuros.</li>
                  <li>O investimento trade pode ser retirado ou alterado do sistema sem aviso prévio.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2 mt-4 bg-muted p-4 rounded-lg">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="h-5 w-5 border-2"
          />
          <Label htmlFor="terms" className="font-semibold text-primary text-base">
            Estou ciente do risco do mercado trade e estou de acordo com todos os termos apresentados
          </Label>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAcceptTerms} 
            disabled={loading || !accepted}
            className="min-w-[120px]"
          >
            {loading ? "Processando..." : "Aceitar Termos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}