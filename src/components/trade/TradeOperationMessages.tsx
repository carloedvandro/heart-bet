import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OperationProgress } from "./OperationProgress";

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

  useEffect(() => {
    console.log("TradeOperationMessages - isOperating:", isOperating);
    
    if (!isOperating) {
      setMessages([]);
      setCurrentMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      if (currentMessageIndex < OPERATION_MESSAGES.length) {
        console.log("Adding message:", OPERATION_MESSAGES[currentMessageIndex]);
        setMessages(prev => [...prev, OPERATION_MESSAGES[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        console.log("Operation messages complete, triggering onOperationComplete");
        clearInterval(interval);
        onOperationComplete();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOperating, currentMessageIndex, onOperationComplete]);

  if (!isOperating) {
    console.log("TradeOperationMessages - Not operating, returning null");
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
            <OperationProgress value={(index + 1) * (100 / OPERATION_MESSAGES.length)} className="mt-1" />
          )}
        </div>
      ))}
    </div>
  );
}