import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InvestmentBalanceProps {
  lockedUntil: string;
  currentBalance: number;
  status: string;
  investmentId: string;
  onDelete?: () => void;
}

export function InvestmentBalance({ 
  lockedUntil, 
  currentBalance, 
  status,
  investmentId,
  onDelete 
}: InvestmentBalanceProps) {
  const handleDelete = async () => {
    try {
      // Primeiro, verificar se o investimento ainda existe e está cancelado
      const { data: investment, error: checkError } = await supabase
        .from('trade_investments')
        .select('status')
        .eq('id', investmentId)
        .single();

      if (checkError) {
        console.error('Error checking investment:', checkError);
        toast.error('Erro ao verificar investimento');
        return;
      }

      if (!investment || investment.status !== 'cancelled') {
        toast.error('Este investimento não pode ser deletado');
        return;
      }

      // Proceder com a deleção
      const { error: deleteError } = await supabase
        .from('trade_investments')
        .delete()
        .eq('id', investmentId)
        .eq('status', 'cancelled');

      if (deleteError) {
        console.error('Error deleting investment:', deleteError);
        toast.error('Erro ao deletar investimento');
        return;
      }
      
      toast.success('Investimento deletado com sucesso');
      onDelete?.();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('Erro ao deletar investimento');
    }
  };

  return (
    <div className="text-right space-y-2">
      <p className="text-sm text-gray-500">
        Bloqueado até: {new Date(lockedUntil).toLocaleDateString()}
      </p>
      <p className="font-semibold">
        Saldo atual: {formatCurrency(currentBalance)}
      </p>
      {status === 'cancelled' && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="w-full sm:w-auto gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Deletar
        </Button>
      )}
    </div>
  );
}