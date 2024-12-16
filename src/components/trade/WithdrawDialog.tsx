import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const today = new Date();
    if (today.getDay() !== 5) { // 5 = Friday
      toast.error("Saques só podem ser solicitados às sextas-feiras");
      return;
    }

    try {
      setLoading(true);
      const numericAmount = Number(amount);
      const feeAmount = numericAmount * 0.05; // 5% fee
      const netAmount = numericAmount - feeAmount;

      // TODO: Implement withdrawal logic
      toast.success("Solicitação de saque enviada com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao solicitar saque");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor do Saque</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {amount && (
              <p className="text-sm text-gray-500 mt-1">
                Taxa (5%): R$ {(Number(amount) * 0.05).toFixed(2)}
                <br />
                Valor líquido: R$ {(Number(amount) * 0.95).toFixed(2)}
              </p>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>Os pedidos de saque podem ser feitos às sextas-feiras.</p>
            <p>O pagamento será realizado até a terça-feira seguinte.</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processando..." : "Confirmar Saque"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}