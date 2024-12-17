import { formatCurrency } from "@/lib/utils";

interface InvestmentInfoProps {
  createdAt: string;
  amount: number;
  dailyRate: number;
  status: string;
}

export function InvestmentInfo({ createdAt, amount, dailyRate, status }: InvestmentInfoProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        Investido em: {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="font-semibold">
        {formatCurrency(amount)}
      </p>
      <p className="text-sm text-green-600">
        Rendimento: {dailyRate}% ao dia
      </p>
      {status === 'cancelled' && (
        <p className="text-sm text-red-500">
          Investimento Cancelado
        </p>
      )}
    </div>
  );
}