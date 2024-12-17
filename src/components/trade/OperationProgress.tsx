import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OperationProgressProps {
  className?: string;
}

export function OperationProgress({ className }: OperationProgressProps) {
  return (
    <Progress 
      value={100} 
      className={cn(
        "h-1 w-full bg-gray-200/50",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
    />
  );
}