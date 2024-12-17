import { Investment } from "@/types/trade";
import { InvestmentCard } from "./InvestmentCard";

interface ActiveInvestmentsProps {
  investments: Investment[];
  onCancelInvestment: (id: string, createdAt: string) => void;
  processingCancellation: string | null;
  onInvestmentDeleted?: () => void;
}

export function ActiveInvestments({ 
  investments, 
  onCancelInvestment, 
  processingCancellation,
  onInvestmentDeleted
}: ActiveInvestmentsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Investimentos</h3>
      <div className="space-y-4">
        {investments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            onCancelInvestment={onCancelInvestment}
            isProcessing={processingCancellation === investment.id}
            onDelete={onInvestmentDeleted}
          />
        ))}
      </div>
    </div>
  );
}