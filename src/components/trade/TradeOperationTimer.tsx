import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInSeconds } from "date-fns";
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
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
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutos em segundos
  const [canOperate, setCanOperate] = useState(false);
  const timeZone = 'America/Sao_Paulo';
  const [lastOperationTime, setLastOperationTime] = useState<Date | null>(null);

  // Fetch the last operation time from the database
  useEffect(() => {
    const fetchLastOperationTime = async () => {
      const { data, error } = await supabase
        .from('trade_investments')
        .select('created_at')
        .eq('id', investmentCreatedAt)
        .single();

      if (error) {
        console.error('Error fetching investment creation time:', error);
        return;
      }

      if (data) {
        const creationTime = toZonedTime(new Date(data.created_at), timeZone);
        setLastOperationTime(creationTime);
      }
    };

    if (isEnabled) {
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentCreatedAt]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime) {
      setTimeLeft(1800);
      setCanOperate(false);
      return;
    }

    // When operation is completed, update the last operation time
    if (operationCompleted) {
      const now = toZonedTime(new Date(), timeZone);
      setLastOperationTime(now);
      setTimeLeft(1800);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = toZonedTime(new Date(), timeZone);
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = 1800 - secondsPassed; // 30 minutos = 1800 segundos

      if (secondsPassed >= 1800) {
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
          Tempo restante para operar: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
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