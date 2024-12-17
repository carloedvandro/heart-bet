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
        "h-1 w-full bg-gray-100 animate-gradient-x bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 background-animate", 
        className
      )} 
    />
  );
}