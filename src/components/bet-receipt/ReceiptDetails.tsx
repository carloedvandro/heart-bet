import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { BetSequenceDisplay } from "./receipt-details/BetSequenceDisplay";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));
  const isMobile = useIsMobile();
  const { isAdmin } = useAdminStatus();

  const textSizeClass = isMobile ? "text-sm" : "text-base";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Data/Hora:</span>
          <span className="font-medium">
            {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
          </span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Período:</span>
          <span className="font-medium">
            {getDrawPeriodName(bet.draw_period)}
          </span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Tipo de Aposta:</span>
          <span className="font-medium">
            {getBetTypeName(bet.bet_type)}
          </span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Posição:</span>
          <span className="font-medium">{bet.position === 5 ? "1º ao 5º" : `${bet.position}º`}</span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Sequência:</span>
          <span className="font-medium">
            <BetSequenceDisplay bet={bet} />
          </span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Valor:</span>
          <span className="font-medium">
            R$ {Number(bet.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-center">
          <span className={`${textSizeClass} text-gray-600`}>Prêmio Potencial:</span>
          <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-green-600`}>
            R$ {potentialPrize.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;