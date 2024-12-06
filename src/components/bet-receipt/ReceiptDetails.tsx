import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));
  const isMobile = useIsMobile();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!profile?.is_admin);
      }
    };

    checkAdminStatus();
  }, [session?.user?.id]);

  const textSizeClass = isMobile ? "text-xs" : "text-sm";

  const renderSequence = () => {
    if (isAdmin) {
      return bet.numbers?.join(", ") || "N/A";
    }
    return (
      <div className="flex gap-1 flex-wrap">
        {bet.hearts?.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="inline-block w-4 h-4 rounded-full"
            style={{ backgroundColor: `var(--heart-${color})` }}
            title={color}
          />
        ))}
      </div>
    );
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