import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  mainValue: string | number;
  mainLabel: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  tertiaryValue?: string | number;
  tertiaryLabel?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  mainValue,
  mainLabel,
  secondaryValue,
  secondaryLabel,
  tertiaryValue,
  tertiaryLabel,
  onClick,
}: DashboardCardProps) {
  return (
    <Card 
      className={`p-6 ${onClick ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        <p className="text-3xl font-bold">{mainValue}</p>
        <p className="text-sm text-gray-500">{mainLabel}</p>
        
        {secondaryValue && secondaryLabel && (
          <>
            <p className="text-xl font-semibold text-green-600">
              {secondaryValue}
            </p>
            <p className="text-sm text-gray-500">{secondaryLabel}</p>
          </>
        )}
        
        {tertiaryValue && tertiaryLabel && (
          <>
            <p className="text-md font-medium text-blue-600">
              {tertiaryValue}
            </p>
            <p className="text-sm text-gray-500">{tertiaryLabel}</p>
          </>
        )}
      </div>
    </Card>
  );
}