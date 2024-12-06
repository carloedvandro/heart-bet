import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bet } from "@/integrations/supabase/custom-types";
import { format } from "date-fns";
import { calculatePrize, Position } from "@/types/betting";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { Receipt } from "lucide-react";

interface BetTableRowProps {
  bet: Bet;
  onViewReceipt: (bet: Bet) => void;
}

export function BetTableRow({ bet, onViewReceipt }: BetTableRowProps) {
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
        {bet.position}º
      </TableCell>
      <TableCell>
        {bet.numbers?.join(", ") || "N/A"}
      </TableCell>
      <TableCell>
        R$ {Number(bet.amount).toFixed(2)}
      </TableCell>
      <TableCell>
        R$ {calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount)).toFixed(2)}
      </TableCell>
      <TableCell>
        {bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando sorteio"}
      </TableCell>
      <TableCell>
        {bet.prize_amount ? (
          <span className="text-green-600 font-medium">
            R$ {Number(bet.prize_amount).toFixed(2)}
          </span>
        ) : bet.is_winner === false ? (
          <span className="text-red-600 font-medium">Não premiado</span>
        ) : (
          "Pendente"
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewReceipt(bet)}
          className="flex items-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          Comprovante
        </Button>
      </TableCell>
    </TableRow>
  );
}