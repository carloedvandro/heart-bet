import { Card, CardContent } from "@/components/ui/card";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { useState, memo, useEffect } from "react";
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
  const [canCancel, setCanCancel] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isOperating, setIsOperating] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const createdAt = new Date(investment.created_at);
      const minutesPassed = differenceInMinutes(now, createdAt);
      const secondsPassed = differenceInSeconds(now, createdAt);
      const remainingSeconds = Math.max(300 - secondsPassed, 0); // 5 minutes in seconds
      
      setTimeLeft(remainingSeconds);
      setCanCancel(minutesPassed < 5 && investment.status === 'active');
      
      // Log for debugging
      console.log('Time calculation:', {
        now: now.toISOString(),
        createdAt: createdAt.toISOString(),
        minutesPassed,
        secondsPassed,
        remainingSeconds,
        canCancel: minutesPassed < 5
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [investment.created_at, investment.status]);

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

  // Format remaining time as MM:SS
  const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
              timeLeft={timeLeft > 0 ? formatTimeLeft(timeLeft) : null}
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