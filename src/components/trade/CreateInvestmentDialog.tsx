import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface CreateInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvestmentDialog({ open, onOpenChange }: CreateInvestmentDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState<'7' | '30'>('7');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !amount || !lockPeriod) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);
      const lockPeriodDays = Number(lockPeriod);
      const dailyRate = lockPeriodDays === 7 ? 0.5 : 1;
      
      const lockedUntil = new Date();
      lockedUntil.setDate(lockedUntil.getDate() + lockPeriodDays);

      // Primeiro, verificar se o usuário tem saldo suficiente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile || profile.balance < numericAmount) {
        toast.error("Saldo insuficiente para realizar este investimento");
        return;
      }

      // Iniciar uma transação para garantir a consistência dos dados
      const { data: investment, error: investmentError } = await supabase
        .from('trade_investments')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
          lock_period: lockPeriodDays,
          daily_rate: dailyRate,
          locked_until: lockedUntil.toISOString(),
          current_balance: numericAmount
        })
        .select()
        .single();

      if (investmentError) throw investmentError;

      // Atualizar o saldo do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - numericAmount })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Registrar no histórico de saldo
      const { error: historyError } = await supabase
        .from('balance_history')
        .insert({
          user_id: session.user.id,
          operation_type: 'trade_investment',
          amount: numericAmount,
          previous_balance: profile.balance,
          new_balance: profile.balance - numericAmount,
          admin_id: session.user.id
        });

      if (historyError) throw historyError;

      toast.success("Investimento criado com sucesso!");
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao criar investimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Investimento Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor do Investimento</Label>
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

          <div>
            <Label htmlFor="lockPeriod">Período de Bloqueio</Label>
            <Select
              value={lockPeriod}
              onValueChange={(value: '7' | '30') => setLockPeriod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias (0,5% ao dia)</SelectItem>
                <SelectItem value="30">30 dias (1% ao dia)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processando..." : "Confirmar Investimento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}