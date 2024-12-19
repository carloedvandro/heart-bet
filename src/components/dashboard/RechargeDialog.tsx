import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRechargeCreated?: () => void;
}

export function RechargeDialog({ 
  open, 
  onOpenChange,
  onRechargeCreated 
}: RechargeDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [showBinanceDialog, setShowBinanceDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !amount) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);

      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      const { data: pixCode, error: pixError } = await supabase.functions.invoke('generate-pix', {
        body: { 
          amount: numericAmount,
          recharge_id: recharge.id
        }
      });

      if (pixError) throw pixError;

      toast.success("Recarga criada com sucesso!");
      onOpenChange(false);
      onRechargeCreated?.();
      setAmount('');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao criar recarga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Recarga</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowBinanceDialog(true)}
              >
                Pagar com Binance
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  // Implementar outros métodos de pagamento aqui
                }}
              >
                Outros Métodos
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou pague via PIX
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Valor da Recarga</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processando..." : "Gerar PIX"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <BinancePaymentDialog
        open={showBinanceDialog}
        onOpenChange={setShowBinanceDialog}
        onPaymentCreated={onRechargeCreated}
      />
    </>
  );
}