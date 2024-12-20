import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const PIX_KEY = "30.266.458/0001-58";

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Recarga</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 pr-4">
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
  );
}