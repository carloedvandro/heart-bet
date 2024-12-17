import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInSeconds } from "date-fns";
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { supabase } from "@/integrations/supabase/client";

interface TradeOperationTimerProps {
  investmentId: string;
  onOperationStart: () => void;
  isEnabled: boolean;
  operationCompleted: boolean;
}

export function TradeOperationTimer({ 
  investmentId,
  onOperationStart,
  isEnabled,
  operationCompleted
}: TradeOperationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(86400); 
  const [canOperate, setCanOperate] = useState(false);
  const timeZone = 'America/Sao_Paulo';
  const [lastOperationTime, setLastOperationTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastOperationTime = async () => {
    try {
      setIsLoading(true);
      
      if (!investmentId || investmentId === 'active') {
        console.error('Invalid investment ID:', investmentId);
        return;
      }

      const { data: operations, error } = await supabase
        .from('trade_operations')
        .select('operated_at')
        .eq('investment_id', investmentId)
        .order('operated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching last operation time:', error);
        return;
      }

      const now = toZonedTime(new Date(), timeZone);

      if (operations && operations.length > 0) {
        const lastOpTime = new Date(operations[0].operated_at);
        const zonedLastOpTime = toZonedTime(lastOpTime, timeZone);
        console.log('Last operation time:', formatInTimeZone(zonedLastOpTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
        setLastOperationTime(zonedLastOpTime);
      } else {
        const { data: investment, error: investmentError } = await supabase
          .from('trade_investments')
          .select('created_at')
          .eq('id', investmentId)
          .single();

        if (investmentError) {
          console.error('Error fetching investment creation time:', investmentError);
          return;
        }

        if (investment) {
          const creationTime = new Date(investment.created_at);
          const zonedCreationTime = toZonedTime(creationTime, timeZone);
          console.log('Investment creation time:', formatInTimeZone(zonedCreationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
          setLastOperationTime(zonedCreationTime);
        }
      }
    } catch (error) {
      console.error('Error in fetchLastOperationTime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled && investmentId) {
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentId]);

  useEffect(() => {
    if (operationCompleted) {
      const now = new Date();
      const zonedNow = toZonedTime(now, timeZone);
      console.log('Operation completed, setting new last operation time:', 
        formatInTimeZone(zonedNow, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      setLastOperationTime(zonedNow);
      setTimeLeft(86400);
      setCanOperate(false);
    }
  }, [operationCompleted, timeZone]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime || isLoading) {
      setTimeLeft(86400);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const zonedNow = toZonedTime(now, timeZone);
      console.log('Current time:', formatInTimeZone(zonedNow, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      console.log('Last operation time:', formatInTimeZone(lastOperationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      
      const secondsPassed = differenceInSeconds(zonedNow, lastOperationTime);
      console.log('Seconds passed:', secondsPassed);
      
      const remaining = Math.max(86400 - secondsPassed, 0);
      console.log('Remaining seconds:', remaining);

      setTimeLeft(remaining);
      setCanOperate(secondsPassed >= 86400);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isEnabled, lastOperationTime, timeZone, isLoading]);

  if (!isEnabled) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Carregando cronômetro...
        </div>
      ) : !canOperate ? (
        <div className="text-sm text-muted-foreground">
          Tempo restante para operar: {formatTime(timeLeft)}
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