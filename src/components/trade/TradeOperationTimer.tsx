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
  const [timeLeft, setTimeLeft] = useState<number>(30);
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

      const { data: operations, error: operationError } = await supabase
        .from('trade_operations')
        .select('operated_at')
        .eq('investment_id', investmentId)
        .order('operated_at', { ascending: false })
        .limit(1);

      if (operationError) {
        console.error('Error fetching operations:', operationError);
        return;
      }

      if (!operations || operations.length === 0) {
        const { data: investment, error: investmentError } = await supabase
          .from('trade_investments')
          .select('created_at')
          .eq('id', investmentId)
          .single();

        if (investmentError) {
          console.error('Error fetching investment:', investmentError);
          return;
        }

        if (investment) {
          const creationTime = toZonedTime(new Date(investment.created_at), timeZone);
          console.log('Using investment creation time:', formatInTimeZone(creationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
          setLastOperationTime(creationTime);
        }
      } else {
        const lastOpTime = toZonedTime(new Date(operations[0].operated_at), timeZone);
        console.log('Found last operation time:', formatInTimeZone(lastOpTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
        setLastOperationTime(lastOpTime);
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
      const now = toZonedTime(new Date(), timeZone);
      setLastOperationTime(now);
      setTimeLeft(30);
      setCanOperate(false);
    }
  }, [operationCompleted, timeZone]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime || isLoading) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = toZonedTime(new Date(), timeZone);
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = Math.max(30 - secondsPassed, 0);
      
      console.log('Operation timer calculation:', {
        now: formatInTimeZone(now, timeZone, 'yyyy-MM-dd HH:mm:ss'),
        lastOperation: formatInTimeZone(lastOperationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'),
        secondsPassed,
        remaining
      });

      setTimeLeft(remaining);
      setCanOperate(secondsPassed >= 30);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isEnabled, lastOperationTime, timeZone, isLoading]);

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Carregando cronômetro...
        </div>
      ) : !canOperate ? (
        <div className="text-sm text-muted-foreground">
          Tempo restante para operar: {timeLeft} segundos
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