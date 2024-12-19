import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface BinancePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentCreated?: () => void;
}

export function BinancePaymentDialog({ 
  open, 
  onOpenChange,
  onPaymentCreated 
}: BinancePaymentDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !amount) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);

      const { data, error } = await supabase.functions.invoke('generate-binance-payment', {
        body: {
          amount: numericAmount,
          user_id: session.user.id
        }
      });

      if (error) throw error;

      toast.success("Pagamento Binance gerado com sucesso!");
      onOpenChange(false);
      onPaymentCreated?.();
      setAmount('');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao gerar pagamento Binance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via Binance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor em USDT</Label>
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
            {loading ? "Processando..." : "Gerar Pagamento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}