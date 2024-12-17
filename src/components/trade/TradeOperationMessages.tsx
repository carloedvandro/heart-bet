import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OperationProgress } from "./OperationProgress";

interface TradeOperationMessagesProps {
  isOperating: boolean;
  onOperationComplete: () => void;
}

const OPERATION_MESSAGES = [
  "Processo de transação iniciado...",
  "Executando negociações...",
  "Processando fila de operações...",
  "Executando ordem de compra...",
  "Executando ordem de venda...",
  "Capturando preços de mercado...",
  "Distribuindo comissões...",
  "Operação concluída com sucesso!"
];

export function TradeOperationMessages({ 
  isOperating,
  onOperationComplete 
}: TradeOperationMessagesProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log('TradeOperationMessages - isOperating:', isOperating);
    
    if (!isOperating) {
      console.log('TradeOperationMessages - Not operating, resetting state');
      setMessages([]);
      setCurrentMessageIndex(0);
      return;
    }

    console.log('TradeOperationMessages - Starting message interval');
    const messageInterval = setInterval(() => {
      if (currentMessageIndex < OPERATION_MESSAGES.length) {
        console.log("Adding message:", OPERATION_MESSAGES[currentMessageIndex]);
        setMessages(prev => [...prev, OPERATION_MESSAGES[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        console.log("Operation messages complete, triggering onOperationComplete");
        clearInterval(messageInterval);
        onOperationComplete();
      }
    }, 1000); // Show a new message every second

    return () => {
      console.log('TradeOperationMessages - Cleaning up interval');
      clearInterval(messageInterval);
    };
  }, [isOperating, currentMessageIndex, onOperationComplete]);

  if (!isOperating) {
    console.log('TradeOperationMessages - Not operating, returning null');
    return null;
  }

  return (
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
            <OperationProgress 
              value={(index + 1) * (100 / OPERATION_MESSAGES.length)} 
              className="mt-1" 
            />
          )}
        </div>
      ))}
    </div>
  );
}