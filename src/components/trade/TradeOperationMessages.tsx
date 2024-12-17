import { useEffect, useState } from "react";
import { OperationMessages } from "./operation/OperationMessages";
import { OperationSuccessDialog } from "./operation/OperationSuccessDialog";

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

interface TradeOperationMessagesProps {
  isOperating: boolean;
  onOperationComplete: () => void;
}

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
      <OperationMessages messages={messages} />
      <OperationSuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        amount={operationAmount}
      />
    </>
  );
}