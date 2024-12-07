import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bet } from "@/integrations/supabase/custom-types";
import { format } from "date-fns";
import { calculatePrize, Position } from "@/types/betting";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { Receipt } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { BetCircles } from "./bet-display/BetCircles";
import { PrizeStatus } from "./bet-display/PrizeStatus";

interface BetTableRowProps {
  bet: Bet;
  onViewReceipt: (bet: Bet) => void;
}

export function BetTableRow({ bet, onViewReceipt }: BetTableRowProps) {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching admin status:', error);
          return;
        }

        setIsAdmin(!!profile?.is_admin);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
      }
    };

    checkAdminStatus();
  }, [session?.user?.id]);

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
        <BetCircles 
          hearts={bet.hearts}
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