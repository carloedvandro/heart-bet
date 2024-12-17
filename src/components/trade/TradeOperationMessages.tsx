import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OperationProgress } from "./OperationProgress";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TradeOperationMessagesProps {
  isOperating: boolean;
  onOperationComplete: () => void;
}

const OPERATION_MESSAGES = [
  "Processo de transação.",
  "Comece a executar negociações...",
  "Comece a fazer fila...",
  "Comece a executar a ordem de compra...",
  "Comece a executar a ordem de venda...",
  "Comece a capturar preços de mercado de negociação...",
  "Comece a distribuir comissões...",
  "A operação está concluída e terminando."
];

export function TradeOperationMessages({ 
  isOperating,
  onOperationComplete 
}: TradeOperationMessagesProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [operationAmount, setOperationAmount] = useState<number>(0);

  useEffect(() => {
    if (!isOperating) {
      setMessages([]);
      setCurrentMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      if (currentMessageIndex < OPERATION_MESSAGES.length) {
        setMessages(prev => [...prev, OPERATION_MESSAGES[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        // Gerar um valor aleatório entre 0.5 e 2.0 para simular o ganho
        const amount = Number((Math.random() * (2.0 - 0.5) + 0.5).toFixed(2));
        setOperationAmount(amount);
        setShowSuccessDialog(true);
        onOperationComplete();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOperating, currentMessageIndex, onOperationComplete]);

  if (!isOperating && !showSuccessDialog) return null;

  return (
    <>
      <div className="space-y-2 p-4 bg-black/5 rounded-lg">
        {messages.map((message, index) => (
          <div key={index} className="space-y-2">
            <p className={cn(
              "text-sm transition-all duration-500",
              index === messages.length - 1 ? "text-green-600 font-medium" : "text-muted-foreground"
            )}>
              {message}
            </p>
            {index === messages.length - 1 && (
              <OperationProgress className="mt-1" />
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-green-600">
              Operação Realizada com Sucesso!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Valor da operação: R$ {operationAmount.toFixed(2)}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}