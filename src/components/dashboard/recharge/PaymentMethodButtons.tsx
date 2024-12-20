import { Button } from "@/components/ui/button";
import { Wallet2, CreditCard } from "lucide-react";

interface PaymentMethodButtonsProps {
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
}

export function PaymentMethodButtons({ onBinanceClick, onOtherMethodsClick }: PaymentMethodButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="w-full h-14 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:from-purple-900/30 dark:to-pink-900/30 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 dark:border-purple-700 group" 
        onClick={onBinanceClick}
      >
        <Wallet2 className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Pagar com Binance</span>
      </Button>
      <Button 
        variant="outline" 
        className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 dark:border-purple-700 group"
        onClick={onOtherMethodsClick}
      >
        <CreditCard className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Outros Métodos</span>
      </Button>
    </div>
  );
}