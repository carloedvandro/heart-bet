import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { PaymentMethodButtons } from "./recharge/PaymentMethodButtons";
import { PixInstructions } from "./recharge/PixInstructions";
import { ProofUploader } from "./recharge/ProofUploader";
import { PaymentProofsList } from "./recharge/PaymentProofsList";
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

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
  const [showInstructions, setShowInstructions] = useState(false);
  const PIX_KEY = "30.266.458/0001-58";

  // Show instructions when dialog opens
  useEffect(() => {
    if (open) {
      setShowInstructions(true);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Recarga</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6 pr-4">
              <PaymentMethodButtons
                onBinanceClick={() => setShowBinanceDialog(true)}
                onOtherMethodsClick={() => onOpenChange(false)}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
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
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
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

      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Instruções Importantes</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Para completar sua recarga, siga estes passos:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Faça o pagamento PIX usando o QR Code ou a chave fornecida</li>
                <li>Salve o comprovante de pagamento no seu dispositivo</li>
                <li>Use o botão "Escolher arquivo" para enviar o comprovante</li>
                <li>Aguarde a confirmação do pagamento</li>
              </ol>
              <p className="text-sm font-medium text-yellow-600 mt-4">
                ⚠️ Importante: Sua recarga só será efetivada após o envio do comprovante!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}