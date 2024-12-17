import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bet } from "@/integrations/supabase/custom-types";
import { format } from "date-fns";
import { calculatePrize, Position } from "@/types/betting";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { Receipt, Trash2 } from "lucide-react";
import { BetCircles } from "./bet-display/BetCircles";
import { PrizeStatus } from "./bet-display/PrizeStatus";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BetTableRowProps {
  bet: Bet;
  onViewReceipt: (bet: Bet) => void;
  onBetDeleted?: () => void;
}

export function BetTableRow({ bet, onViewReceipt, onBetDeleted }: BetTableRowProps) {
  const { isAdmin } = useAdminStatus();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('bets')
        .delete()
        .eq('id', bet.id);

      if (error) throw error;
      
      toast.success('Aposta excluída com sucesso');
      if (onBetDeleted) {
        onBetDeleted();
      }
    } catch (error) {
      console.error('Error deleting bet:', error);
      toast.error('Erro ao excluir aposta');
    }
  };

  return (
    <TableRow>
      <TableCell>
        #{bet.bet_number || "N/A"}
      </TableCell>
      <TableCell>
        {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
      </TableCell>
      <TableCell>
        {getDrawPeriodName(bet.draw_period)}
      </TableCell>
      <TableCell>
        {getBetTypeName(bet.bet_type)}
      </TableCell>
      <TableCell>
        {bet.position === 5 ? "1º ao 5º" : `${bet.position}º`}
      </TableCell>
      <TableCell>
        <BetCircles 
          betType={bet.bet_type}
          isAdmin={isAdmin}
          numbers={bet.numbers}
        />
      </TableCell>
      <TableCell>
        R$ {Number(bet.amount).toFixed(2)}
      </TableCell>
      <TableCell>
        R$ {calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount)).toFixed(2)}
      </TableCell>
      <TableCell>
        {isAdmin && bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando sorteio"}
      </TableCell>
      <TableCell>
        <PrizeStatus prizeAmount={bet.prize_amount} isWinner={bet.is_winner} />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReceipt(bet)}
            className="flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Comprovante
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}