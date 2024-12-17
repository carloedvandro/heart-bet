import { cn } from "@/lib/utils";

export function OperationProgress() {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        className={cn(
          "h-full bg-gradient-to-r from-green-500 via-green-300 to-green-500",
          "animate-shimmer bg-[length:200%_100%]"
        )}
      />
    </div>
  );
}