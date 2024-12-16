import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface InvestmentStatsProps {
  totalInvested: number;
  totalEarnings: number;
  isLoading: boolean;
}

export function InvestmentStats({ totalInvested, totalEarnings, isLoading }: InvestmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Investido</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <span className="text-2xl font-bold">
              R$ {totalInvested.toFixed(2)}
            </span>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <span className="text-2xl font-bold text-green-600">
              R$ {totalEarnings.toFixed(2)}
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}