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
      const { error } = await supabase
        .from('trade_investments')
        .delete()
        .eq('id', investmentId)
        .eq('status', 'cancelled'); // Only allow deletion of cancelled investments

      if (error) throw error;
      
      toast.success('Investimento deletado com sucesso');
      onDelete?.();
    } catch (error) {
      console.error('Error deleting investment:', error);
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