import { Button } from "@/components/ui/button";
import { Wallet2, CreditCard, QrCode } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentMethodButtonsProps {
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
}

export function PaymentMethodButtons({ 
  onBinanceClick, 
  onOtherMethodsClick 
}: PaymentMethodButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleAsaasClick = async () => {
    try {
      setLoading(true);
      console.log('Generating Asaas payment link...');
      
      const { data, error } = await supabase.functions.invoke('generate-asaas-payment-link', {
        body: { amount: 50 } // Valor mínimo fixo, usuário poderá alterar na página do Asaas
      });

      if (error) {
        console.error('Error generating payment link:', error);
        throw error;
      }

      console.log('Payment link response:', data);

      if (data?.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      } else {
        throw new Error('URL de pagamento não gerada');
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error("Erro ao gerar link de pagamento. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button 
        variant="outline" 
        className="w-full h-10 md:h-14 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:from-purple-900/30 dark:to-pink-900/30 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 dark:border-purple-700 group text-xs md:text-sm" 
        onClick={onBinanceClick}
      >
        <Wallet2 className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Binance</span>
      </Button>

      <Button 
        variant="outline" 
        className="w-full h-10 md:h-14 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 transition-all duration-300 dark:from-green-900/30 dark:to-emerald-900/30 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 dark:border-green-700 group text-xs md:text-sm"
        onClick={handleAsaasClick}
        disabled={loading}
      >
        <QrCode className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">
          {loading ? 'Carregando...' : 'PIX Asaas'}
        </span>
      </Button>

      <Button 
        variant="outline" 
        className="w-full h-10 md:h-14 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 dark:border-purple-700 group text-xs md:text-sm"
        onClick={onOtherMethodsClick}
      >
        <CreditCard className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Outros</span>
      </Button>
    </div>
  );
}