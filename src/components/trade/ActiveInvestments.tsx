import { Investment } from "@/types/trade";
import { InvestmentCard } from "./InvestmentCard";

interface ActiveInvestmentsProps {
  investments: Investment[];
  onCancelInvestment: (id: string, createdAt: string) => void;
  processingCancellation: string | null;
}

export function ActiveInvestments({ 
  investments, 
  onCancelInvestment,
  processingCancellation 
}: ActiveInvestmentsProps) {
  const handleDelete = () => {
    // Recarregar a lista de investimentos
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <InvestmentCard
          key={investment.id}
          investment={investment}
          onCancelInvestment={onCancelInvestment}
          isProcessing={processingCancellation === investment.id}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}