import { Bet } from "@/integrations/supabase/custom-types";
import { Card, CardContent } from "./ui/card";
import { useRef } from "react";
import ReceiptHeader from "./bet-receipt/ReceiptHeader";
import ReceiptDetails from "./bet-receipt/ReceiptDetails";
import ReceiptActions from "./bet-receipt/ReceiptActions";

interface BetReceiptProps {
  bet: Bet;
  onReset?: () => void;
}

const BetReceipt = ({ bet, onReset }: BetReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="w-full bg-white shadow-lg animate-fade-in font-mono" ref={receiptRef} data-receipt>
      <ReceiptHeader betNumber={bet.bet_number || ''} />
      
      <CardContent className="space-y-3 p-0">
        <ReceiptDetails bet={bet} />
        <ReceiptActions bet={bet} receiptRef={receiptRef} onReset={onReset} />

        <div className="text-center text-[10px] text-gray-500 pt-2 border-t border-dashed border-gray-200 px-3 pb-4">
          * Guarde este comprovante
        </div>
      </CardContent>
    </Card>
  );
};

export default BetReceipt;