import { Progress } from "@/components/ui/progress";

interface OperationProgressProps {
  value: number;
}

export function OperationProgress({ value }: OperationProgressProps) {
  return (
    <div className="relative w-full">
      <Progress value={value} className="h-2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
      </Progress>
    </div>
  );
}