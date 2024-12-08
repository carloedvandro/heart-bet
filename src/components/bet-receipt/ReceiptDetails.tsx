import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminStatus } from "@/hooks/useAdminStatus";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));
  const isMobile = useIsMobile();
  const { isAdmin } = useAdminStatus();

  const textSizeClass = isMobile ? "text-xs" : "text-sm";

  // Função para formatar números com dois dígitos
  const formatNumber = (num: string) => {
    const parsedNum = parseInt(num, 10);
    return parsedNum.toString().padStart(2, '0');
  };

  const renderSequence = () => {
    // Mostrar números apenas para grupo simples e milhar
    if (bet.bet_type === 'simple_group' && bet.numbers?.length) {
      return bet.numbers.map(formatNumber).join(", ");
    }

    if (bet.bet_type === 'thousand' && bet.numbers?.length) {
      return bet.numbers.map(formatNumber).join(", ");
    }

    // Para todos os outros tipos, mostrar corações
    if (bet.hearts?.length) {
      return (
        <div className="flex gap-1 flex-wrap">
          {bet.hearts.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="inline-block w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: `var(--heart-${color})` }}
              title={color}
            />
          ))}
        </div>
      );
    }

    return "N/A";
  };

  return (
    <>
      <div className="space-y-2 px-4">
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
          <span className="font-medium">{bet.position}º</span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Sequência:</span>
          <span className="font-medium">
            {renderSequence()}
          </span>
        </div>
        <div className={`flex justify-between ${textSizeClass} items-center`}>
          <span className="text-gray-600">Valor:</span>
          <span className="font-medium">
            R$ {Number(bet.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-dashed border-gray-200 px-4 mt-3">
        <div className="flex justify-between items-center">
          <span className={`${textSizeClass} text-gray-600`}>Prêmio Potencial:</span>
          <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-green-600`}>
            R$ {potentialPrize.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetails;