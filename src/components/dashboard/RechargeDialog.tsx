import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { useState } from "react";
import { RechargeContent } from "./recharge/RechargeContent";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRechargeCreated?: () => void;
}

export function RechargeDialog({ 
  open, 
  onOpenChange,
  onRechargeCreated 
}: RechargeDialogProps) {
  const [showBinanceDialog, setShowBinanceDialog] = useState(false);
  const PIX_KEY = "30.266.458/0001-58";

  const handleClose = () => {
    toast.info(
      "Não se esqueça de enviar o comprovante do seu pagamento PIX. Sem o comprovante, não será possível completar sua recarga.",
      {
        duration: 5000,
      }
    );
    onOpenChange(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            handleClose();
          } else {
            onOpenChange(true);
          }
        }}
      >
        <DialogContent className="max-w-xl bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nova Recarga
            </DialogTitle>
          </DialogHeader>
          
          <Alert className="animate-gradient-x bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-purple-300 mb-4">
            <AlertDescription className="text-center text-purple-800 font-semibold">
              Não se esqueça de enviar o comprovante do seu pagamento PIX!
            </AlertDescription>
          </Alert>

          <div className="overflow-y-auto">
            <RechargeContent
              pixKey={PIX_KEY}
              onBinanceClick={() => setShowBinanceDialog(true)}
              onOtherMethodsClick={() => onOpenChange(false)}
              onProofUploaded={() => {
                onRechargeCreated?.();
                onOpenChange(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <BinancePaymentDialog
        open={showBinanceDialog}
        onOpenChange={setShowBinanceDialog}
        onPaymentCreated={onRechargeCreated}
      />
    </>
  );
}