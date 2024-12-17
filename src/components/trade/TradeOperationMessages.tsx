import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
        onOperationComplete();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOperating, currentMessageIndex, onOperationComplete]);

  if (!isOperating) return null;

  return (
    <div className="space-y-2 p-4 bg-black/5 rounded-lg">
      {messages.map((message, index) => (
        <p 
          key={index}
          className={cn(
            "text-sm transition-all duration-500",
            index === messages.length - 1 ? "text-green-600 font-medium" : "text-muted-foreground"
          )}
        >
          {message}
        </p>
      ))}
    </div>
  );
}