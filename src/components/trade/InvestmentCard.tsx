import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInHours } from "date-fns";

interface Investment {
  id: string;
  created_at: string;
  amount: number;
  daily_rate: number;
  locked_until: string;
  current_balance: number;
  status: string;
}

interface InvestmentCardProps {
  investment: Investment;
  onCancelInvestment: (id: string, createdAt: string) => void;
  isProcessing: boolean;
}

export function InvestmentCard({ investment, onCancelInvestment, isProcessing }: InvestmentCardProps) {
  const hoursSinceCreation = differenceInHours(
    new Date(), 
    new Date(investment.created_at)
  );
  const canCancel = hoursSinceCreation <= 2 && investment.status === 'active';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Investido em: {new Date(investment.created_at).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              R$ {Number(investment.amount).toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              Rendimento: {investment.daily_rate}% ao dia
            </p>
            {investment.status === 'cancelled' && (
              <p className="text-sm text-red-500 mt-2">
                Investimento Cancelado
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Bloqueado até: {new Date(investment.locked_until).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              Saldo atual: R$ {Number(investment.current_balance).toFixed(2)}
            </p>
            {canCancel ? (
              <Button 
                variant="destructive" 
                size="sm"
                className="mt-2"
                onClick={() => onCancelInvestment(investment.id, investment.created_at)}
                disabled={investment.status !== 'active' || isProcessing}
              >
                {isProcessing ? "Cancelando..." : "Cancelar Investimento"}
              </Button>
            ) : investment.status === 'cancelled' && (
              <p className="text-sm text-red-500 mt-2">
                Investimento cancelado em {new Date().toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}