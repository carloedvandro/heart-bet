import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface OperationProgressProps {
  value?: number;
  className?: string;
}

export function OperationProgress({ value = 0, className }: OperationProgressProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Progress value={value} className="h-2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </Progress>
    </div>
  );
}