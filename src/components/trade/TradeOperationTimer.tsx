import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInSeconds } from "date-fns";
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { supabase } from "@/integrations/supabase/client";

interface TradeOperationTimerProps {
  investmentCreatedAt: string;
  onOperationStart: () => void;
  isEnabled: boolean;
  operationCompleted: boolean;
}

export function TradeOperationTimer({ 
  investmentCreatedAt, 
  onOperationStart,
  isEnabled,
  operationCompleted
}: TradeOperationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canOperate, setCanOperate] = useState(false);
  const timeZone = 'America/Sao_Paulo';
  const [lastOperationTime, setLastOperationTime] = useState<Date | null>(null);

  // Fetch the last operation time from the database
  useEffect(() => {
    const fetchLastOperationTime = async () => {
      const { data, error } = await supabase
        .from('trade_operations')
        .select('operated_at, next_operation_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching last operation time:', error);
        return;
      }

      if (data) {
        const nextOperationAt = data.next_operation_at 
          ? toZonedTime(new Date(data.next_operation_at), timeZone)
          : toZonedTime(new Date(data.operated_at), timeZone);
        setLastOperationTime(nextOperationAt);
      } else {
        // If no operations yet, use investment creation time
        const creationTime = toZonedTime(new Date(investmentCreatedAt), timeZone);
        setLastOperationTime(creationTime);
      }
    };

    if (isEnabled) {
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentCreatedAt]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime) {
      setTimeLeft(60);
      setCanOperate(false);
      return;
    }

    // When operation is completed, update the last operation time
    if (operationCompleted) {
      const now = toZonedTime(new Date(), timeZone);
      setLastOperationTime(now);
      setTimeLeft(60);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = toZonedTime(new Date(), timeZone);
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = 60 - (secondsPassed % 60);

      if (secondsPassed >= 60) {
        setCanOperate(true);
        setTimeLeft(0);
      } else {
        setCanOperate(false);
        setTimeLeft(remaining);
      }
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(interval);
  }, [isEnabled, operationCompleted, lastOperationTime, timeZone]);

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      {!canOperate ? (
        <div className="text-sm text-muted-foreground">
          Tempo restante para operar: {timeLeft}s
        </div>
      ) : (
        <Button 
          onClick={onOperationStart}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          Operar Mercado
        </Button>
      )}
    </div>
  );
}