import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WithdrawalHistory } from "./WithdrawalHistory";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useSession } from "@supabase/auth-helpers-react";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const today = new Date();
    if (today.getDay() !== 5) { // 5 = Friday
      toast.error("Saques só podem ser solicitados às sextas-feiras");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmWithdrawal = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para solicitar um saque");
      return;
    }

    try {
      setLoading(true);
      const numericAmount = Number(amount);
      const feeAmount = numericAmount * 0.05; // 5% fee
      const netAmount = numericAmount - feeAmount;

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
          fee_amount: feeAmount,
          net_amount: netAmount
        });

      if (error) throw error;

      toast.success("Solicitação de saque enviada com sucesso!");
      setAmount('');
      setShowConfirmation(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao solicitar saque");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

            <WithdrawalHistory />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processando..." : "Confirmar Saque"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Solicitação de Saque</AlertDialogTitle>
            <AlertDialogDescription>
              Você está solicitando um saque de R$ {amount}.<br />
              Taxa (5%): R$ {(Number(amount) * 0.05).toFixed(2)}<br />
              Valor líquido: R$ {(Number(amount) * 0.95).toFixed(2)}<br /><br />
              O pagamento será processado até a próxima terça-feira.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdrawal}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}