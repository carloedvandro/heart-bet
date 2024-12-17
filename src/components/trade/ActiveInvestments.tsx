import { memo } from 'react';
import { InvestmentCard } from "./InvestmentCard";

interface Investment {
  id: string;
  created_at: string;
  amount: number;
  daily_rate: number;
  locked_until: string;
  current_balance: number;
  status: string;
}

interface ActiveInvestmentsProps {
  investments: Investment[];
  onCancelInvestment: (id: string, createdAt: string) => void;
  processingCancellation: string | null;
}

const ActiveInvestments = memo(({ 
  investments, 
  onCancelInvestment,
  processingCancellation 
}: ActiveInvestmentsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Investimentos Ativos</h3>
      <div className="space-y-4">
        {investments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            onCancelInvestment={onCancelInvestment}
            isProcessing={processingCancellation === investment.id}
          />
        ))}
      </div>
    </div>
  );
});

ActiveInvestments.displayName = 'ActiveInvestments';

export { ActiveInvestments };