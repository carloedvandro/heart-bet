import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CloseConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CloseConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: CloseConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Lembrete Importante
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            Não se esqueça de enviar o comprovante do seu pagamento PIX. Sem o comprovante, não será possível completar sua recarga.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700"
          >
            Continuar enviando
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Sair mesmo assim
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}