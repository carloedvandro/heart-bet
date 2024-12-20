import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { PaymentMethodButtons } from "./recharge/PaymentMethodButtons";
import { PixInstructions } from "./recharge/PixInstructions";
import { ProofUploader } from "./recharge/ProofUploader";
import { PaymentProofsList } from "./recharge/PaymentProofsList";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

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
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const PIX_KEY = "30.266.458/0001-58";

  const handleCloseAttempt = () => {
    setShowCloseAlert(true);
  };

  const handleConfirmClose = () => {
    setShowCloseAlert(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCloseAttempt();
        } else {
          onOpenChange(true);
        }
      }}>
        <DialogContent className="max-w-xl bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 pt-[22px]">
          <DialogHeader className="relative flex flex-col items-center">
            <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Nova Recarga
            </DialogTitle>
            <Dialog.Close className="absolute right-0 top-[100%] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
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

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <AlertDialogTitle className="text-lg font-semibold">
              Atenção!
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className="text-base mt-4">
            Lembre-se que é necessário enviar o comprovante do seu pagamento PIX para que sua recarga seja processada. Deseja realmente sair?
          </AlertDialogDescription>
          
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              Continuar enviando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sair mesmo assim
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}