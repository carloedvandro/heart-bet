import { Bet } from "@/integrations/supabase/custom-types";
import { Card, CardContent } from "./ui/card";
import { useRef, useEffect } from "react";
import ReceiptHeader from "./bet-receipt/ReceiptHeader";
import ReceiptDetails from "./bet-receipt/ReceiptDetails";
import ReceiptActions from "./bet-receipt/ReceiptActions";
import { useIsMobile } from "@/hooks/use-mobile";

interface BetReceiptProps {
  bet: Bet;
  onReset?: () => void;
}

const BetReceipt = ({ bet, onReset }: BetReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("BetReceipt - Rendering with bet data:", bet);
    console.log("BetReceipt - Receipt ref exists:", !!receiptRef.current);
  }, [bet]);

  if (!bet) {
    console.error("BetReceipt - No bet data provided");
    return null;
  }

  return (
    <div className={`w-full mx-auto ${isMobile ? 'max-w-[320px]' : 'max-w-md'}`}>
      <Card 
        className="w-full bg-white shadow-lg animate-fade-in relative overflow-hidden print:shadow-none" 
        ref={receiptRef} 
        data-receipt
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          letterSpacing: '0.025em',
          lineHeight: '1.5'
        }}
      >
        <ReceiptHeader betNumber={bet.bet_number || ''} />
        
        <CardContent className="space-y-4 p-6">
          <ReceiptDetails bet={bet} />
          <ReceiptActions bet={bet} receiptRef={receiptRef} onReset={onReset} />

          <div className="text-center text-sm text-gray-500 pt-4 border-t border-dashed border-gray-200">
            * Guarde este comprovante
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetReceipt;