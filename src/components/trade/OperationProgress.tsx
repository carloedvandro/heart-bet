import { cn } from "@/lib/utils";

interface OperationProgressProps {
  value?: number;
  className?: string;
}

export function OperationProgress({ value = 0, className }: OperationProgressProps) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-1.5", className)}>
      <div
        className="bg-primary h-1.5 rounded-full transition-all duration-300 relative overflow-hidden"
        style={{ width: `${value}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}