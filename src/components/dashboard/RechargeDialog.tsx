import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RechargeContent } from "./recharge/RechargeContent";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRechargeCreated?: () => void;
}

export function RechargeDialog({ open, onOpenChange, onRechargeCreated }: RechargeDialogProps) {
  const handleBinanceClick = () => {
    window.open("https://t.me/suporte_lovable", "_blank");
  };

  const handleOtherMethodsClick = () => {
    window.open("https://t.me/suporte_lovable", "_blank");
  };

  useEffect(() => {
    if (!open) return;

    const checkPayments = async () => {
      try {
        const { error } = await supabase.functions.invoke('check-asaas-payments');
        if (error) throw error;
        onRechargeCreated?.();
      } catch (error) {
        console.error('Error checking payments:', error);
        toast.error('Erro ao verificar pagamentos');
      }
    };

    checkPayments();
    const interval = setInterval(checkPayments, 30000);

    return () => clearInterval(interval);
  }, [open, onRechargeCreated]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Recarga</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <RechargeContent
            pixKey="chave-pix@exemplo.com"
            onBinanceClick={handleBinanceClick}
            onOtherMethodsClick={handleOtherMethodsClick}
            onProofUploaded={() => {
              onRechargeCreated?.();
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}