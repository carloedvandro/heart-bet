import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { useState } from "react";
import { RechargeContent } from "./recharge/RechargeContent";
import { CloseConfirmationDialog } from "./recharge/CloseConfirmationDialog";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

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
      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            handleCloseAttempt();
          } else {
            onOpenChange(true);
          }
        }}
      >
        <DialogContent className="max-w-xl bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-0"
              onClick={handleCloseAttempt}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nova Recarga
            </DialogTitle>
          </DialogHeader>
          
          <RechargeContent
            pixKey={PIX_KEY}
            onBinanceClick={() => setShowBinanceDialog(true)}
            onOtherMethodsClick={() => onOpenChange(false)}
            onProofUploaded={() => {
              onRechargeCreated?.();
              onOpenChange(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <CloseConfirmationDialog
        open={showCloseAlert}
        onOpenChange={setShowCloseAlert}
        onConfirm={handleConfirmClose}
      />

      <BinancePaymentDialog
        open={showBinanceDialog}
        onOpenChange={setShowBinanceDialog}
        onPaymentCreated={onRechargeCreated}
      />
    </>
  );
}