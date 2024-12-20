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
    } else {
      // Limpa o estado quando o diálogo principal é fechado
      setShowInstructions(false);
      setShowBinanceDialog(false);
    }
  }, [open]);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) {
            setShowInstructions(false);
            setShowBinanceDialog(false);
          }
        }}
      >
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

      <AlertDialog 
        open={showInstructions} 
        onOpenChange={handleCloseInstructions}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Instruções Importantes</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-2">Para completar sua recarga, siga estes passos:</p>
              <div className="space-y-1">
                <p>1. Faça o pagamento PIX usando o QR Code ou a chave fornecida</p>
                <p>2. Salve o comprovante de pagamento no seu dispositivo</p>
                <p>3. Use o botão "Escolher arquivo" para enviar o comprovante</p>
                <p>4. Aguarde a confirmação do pagamento</p>
              </div>
              <p className="text-sm font-medium text-yellow-600 mt-4">
                ⚠️ Importante: Sua recarga só será efetivada após o envio do comprovante!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseInstructions}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}