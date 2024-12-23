import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RechargeContent } from "./recharge/RechargeContent";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RechargeDialog({ open, onOpenChange }: RechargeDialogProps) {
  const handleBinanceClick = () => {
    window.open("https://t.me/suporte_lovable", "_blank");
  };

  const handleOtherMethodsClick = () => {
    window.open("https://t.me/suporte_lovable", "_blank");
  };

  // Adicionar verificação periódica de pagamentos
  useEffect(() => {
    if (!open) return;

    const checkPayments = async () => {
      try {
        const { error } = await supabase.functions.invoke('check-asaas-payments');
        if (error) throw error;
      } catch (error) {
        console.error('Error checking payments:', error);
        toast.error('Erro ao verificar pagamentos');
      }
    };

    // Verificar imediatamente e depois a cada 30 segundos
    checkPayments();
    const interval = setInterval(checkPayments, 30000);

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recarga</DialogTitle>
        </DialogHeader>
        <RechargeContent
          pixKey="chave-pix@exemplo.com"
          onBinanceClick={handleBinanceClick}
          onOtherMethodsClick={handleOtherMethodsClick}
          onProofUploaded={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}