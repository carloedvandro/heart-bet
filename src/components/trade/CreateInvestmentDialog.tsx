import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

interface CreateInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvestmentCreated?: () => void;
}

export function CreateInvestmentDialog({ 
  open, 
  onOpenChange,
  onInvestmentCreated 
}: CreateInvestmentDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState<'60' | '365'>('60');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !amount || !lockPeriod) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);
      const lockPeriodDays = Number(lockPeriod);
      const dailyRate = lockPeriodDays === 60 ? 0.5 : 1;
      
      const lockedUntil = toZonedTime(new Date(), 'America/Sao_Paulo');
      lockedUntil.setDate(lockedUntil.getDate() + lockPeriodDays);

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

      const { data: investment, error: investmentError } = await supabase
        .from('trade_investments')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
          lock_period: lockPeriodDays,
          daily_rate: dailyRate,
          locked_until: fromZonedTime(lockedUntil, 'America/Sao_Paulo').toISOString(),
          current_balance: numericAmount
        })
        .select()
        .single();

      if (investmentError) throw investmentError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - numericAmount })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase
        .from('balance_history')
        .insert({
          admin_id: session.user.id,
          user_id: session.user.id,
          operation_type: 'trade_investment',
          amount: numericAmount,
          previous_balance: profile.balance,
          new_balance: profile.balance - numericAmount
        });

      if (historyError) throw historyError;

      toast.success("Investimento criado com sucesso!");
      onOpenChange(false);
      onInvestmentCreated?.();
      setAmount('');
      
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
              onValueChange={(value: '60' | '365') => setLockPeriod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 dias (0,5% ao dia)</SelectItem>
                <SelectItem value="365">12 meses (1% ao dia)</SelectItem>
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