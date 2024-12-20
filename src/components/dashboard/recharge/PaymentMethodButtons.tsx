import { Button } from "@/components/ui/button";

interface PaymentMethodButtonsProps {
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
}

export function PaymentMethodButtons({ onBinanceClick, onOtherMethodsClick }: PaymentMethodButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="w-full h-14 text-sm font-medium bg-white/50 hover:bg-purple-500 hover:text-white transition-all duration-300 border-purple-200 hover:border-purple-500" 
        onClick={onBinanceClick}
      >
        Pagar com Binance
      </Button>
      <Button 
        variant="outline" 
        className="w-full h-14 text-sm font-medium bg-white/50 hover:bg-pink-500 hover:text-white transition-all duration-300 border-pink-200 hover:border-pink-500"
        onClick={onOtherMethodsClick}
      >
        Outros Métodos
      </Button>
    </div>
  );
}