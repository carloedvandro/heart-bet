import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface OperationSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
}

export function OperationSuccessDialog({
  open,
  onOpenChange,
  amount
}: OperationSuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[320px]">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-center text-green-600">
            Operação Realizada com Sucesso!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Valor da operação: R$ {amount.toFixed(2)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}