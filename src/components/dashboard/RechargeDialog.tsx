import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { PaymentMethodButtons } from "./recharge/PaymentMethodButtons";
import { PixInstructions } from "./recharge/PixInstructions";
import { ProofUploader } from "./recharge/ProofUploader";
import { PaymentProofsList } from "./recharge/PaymentProofsList";
import { useState } from "react";

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nova Recarga
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-8 pr-4">
              <PaymentMethodButtons
                onBinanceClick={() => setShowBinanceDialog(true)}
                onOtherMethodsClick={() => onOpenChange(false)}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-200 dark:border-purple-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 text-purple-600 dark:text-purple-300 font-medium">
                    Ou pague via PIX
                  </span>
                </div>
              </div>

              <PixInstructions pixKey={PIX_KEY} />
              
              <ProofUploader onProofUploaded={() => {
                onRechargeCreated?.();
                onOpenChange(false);
              }} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-200 dark:border-purple-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 text-purple-600 dark:text-purple-300 font-medium">
                    Seus comprovantes
                  </span>
                </div>
              </div>

              <PaymentProofsList />
            </div>
          </ScrollArea>
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