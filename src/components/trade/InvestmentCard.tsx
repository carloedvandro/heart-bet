import { Card, CardContent } from "@/components/ui/card";
import { differenceInMinutes } from "date-fns";
import { useState, memo } from "react";
import { InvestmentInfo } from "./investment-card/InvestmentInfo";
import { InvestmentBalance } from "./investment-card/InvestmentBalance";
import { InvestmentOperations } from "./investment-card/InvestmentOperations";

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

const InvestmentCard = memo(({ 
  investment, 
  onCancelInvestment, 
  isProcessing
}: InvestmentCardProps) => {
  const [canCancel, setCanCancel] = useState(
    differenceInMinutes(new Date(), new Date(investment.created_at)) <= 30 && 
    investment.status === 'active'
  );
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);

  const handleTimeExpired = () => {
    setCanCancel(false);
  };

  const handleOperationStart = async () => {
    setIsOperating(true);
  };

  const handleOperationComplete = () => {
    setIsOperating(false);
    setOperationCompleted(true);
    setTimeout(() => {
      setOperationCompleted(false);
    }, 60000);
  };

  // Se o status não for 'active', não renderiza o card
  if (investment.status !== 'active') {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <InvestmentInfo 
            createdAt={investment.created_at}
            amount={investment.amount}
            dailyRate={investment.daily_rate}
            status={investment.status}
          />
          
          <div className="flex flex-col gap-4">
            <InvestmentBalance 
              lockedUntil={investment.locked_until}
              currentBalance={investment.current_balance}
              status={investment.status}
              investmentId={investment.id}
            />

            <InvestmentOperations 
              canCancel={canCancel}
              createdAt={investment.created_at}
              status={investment.status}
              isProcessing={isProcessing}
              onCancelInvestment={() => onCancelInvestment(investment.id, investment.created_at)}
              onOperationStart={handleOperationStart}
              onOperationComplete={handleOperationComplete}
              isOperating={isOperating}
              operationCompleted={operationCompleted}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

InvestmentCard.displayName = 'InvestmentCard';

export { InvestmentCard };