import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet2, CreditCard, QrCode } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface PaymentMethodButtonsProps {
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
}

export function PaymentMethodButtons({ 
  onBinanceClick, 
  onOtherMethodsClick 
}: PaymentMethodButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(10);
  const session = useSession();

  const handleAsaasClick = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer uma recarga");
      return;
    }

    if (amount <= 0) {
      toast.error("Por favor, insira um valor válido maior que zero");
      return;
    }

    try {
      setLoading(true);
      
      const requestBody = {
        userId: session.user.id,
        amount: amount
      };
      
      console.log('Payment request details:', {
        requestBody,
        hasSession: !!session,
        accessToken: !!session?.access_token
      });

      // First attempt with direct invoke
      try {
        console.log('Attempting function invoke with body:', JSON.stringify(requestBody));
        
        const { data, error } = await supabase.functions.invoke('generate-asaas-payment-link', {
          body: requestBody,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        console.log('Supabase function response:', { data, error });

        if (error) {
          console.error('Error generating payment link:', error);
          throw new Error(error.message || 'Erro ao gerar link de pagamento');
        }

        if (!data?.paymentUrl) {
          console.error('Invalid payment URL in response:', data);
          throw new Error('Link de pagamento inválido');
        }

        window.open(data.paymentUrl, '_blank');
        toast.success("Link de pagamento gerado com sucesso!");

      } catch (invokeError) {
        console.error('Function invoke failed, attempting direct fetch...', invokeError);
        
        // Fallback to direct fetch if invoke fails
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-asaas-payment-link`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
            },
            body: JSON.stringify(requestBody)
          }
        );

        console.log('Direct fetch response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Direct fetch failed:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Direct fetch response data:', data);
        
        if (!data.paymentUrl) {
          throw new Error('Invalid payment URL in response');
        }

        window.open(data.paymentUrl, '_blank');
        toast.success("Link de pagamento gerado com sucesso!");
      }

    } catch (error) {
      console.error('Payment link generation error:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao gerar link de pagamento. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Valor da Recarga</Label>
        <Input
          id="amount"
          type="number"
          min="10"
          step="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Digite o valor da recarga"
          className="w-full"
        />
      </div>

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
    </div>
  );
}