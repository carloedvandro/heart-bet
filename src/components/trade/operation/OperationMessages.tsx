import { cn } from "@/lib/utils";
import { OperationProgress } from "../OperationProgress";

interface OperationMessagesProps {
  messages: string[];
}

export function OperationMessages({ messages }: OperationMessagesProps) {
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
            <OperationProgress className="mt-1" />
          )}
        </div>
      ))}
    </div>
  );
}