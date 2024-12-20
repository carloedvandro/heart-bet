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
        className="w-full h-12 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors" 
        onClick={onBinanceClick}
      >
        Pagar com Binance
      </Button>
      <Button 
        variant="outline" 
        className="w-full h-12 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={onOtherMethodsClick}
      >
        Outros Métodos
      </Button>
    </div>
  );
}