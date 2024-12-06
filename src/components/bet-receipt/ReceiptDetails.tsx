import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));

  return (
    <>
      <div className="space-y-2 px-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Data/Hora:</span>
          <span className="font-medium text-right flex-1 break-words">
            {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Período:</span>
          <span className="font-medium text-right flex-1 break-words">
            {getDrawPeriodName(bet.draw_period)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Tipo de Aposta:</span>
          <span className="font-medium text-right flex-1 break-words">
            {getBetTypeName(bet.bet_type)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Posição:</span>
          <span className="font-medium text-right flex-1">{bet.position}º</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Números:</span>
          <span className="font-medium text-right flex-1 break-all">
            {bet.numbers.join(", ")}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 min-w-[100px]">Valor:</span>
          <span className="font-medium text-right flex-1">
            R$ {Number(bet.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-dashed border-gray-200 px-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Prêmio Potencial:</span>
          <span className="text-lg font-bold text-green-600">
            R$ {potentialPrize.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetails;