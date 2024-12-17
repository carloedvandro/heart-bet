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
        "h-1 w-full relative overflow-hidden",
        "bg-gradient-to-r from-transparent via-white to-transparent",
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent",
        "after:animate-shimmer after:translate-x-[-100%]",
        className
      )}
    />
  );
}