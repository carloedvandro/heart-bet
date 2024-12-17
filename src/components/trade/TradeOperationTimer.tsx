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

      // Buscar a última operação primeiro
      const { data: operations, error } = await supabase
        .from('trade_operations')
        .select('operated_at')
        .eq('investment_id', investmentId)
        .order('operated_at', { ascending: false })
        .limit(1);

      const now = new Date();
      const zonedNow = toZonedTime(now, timeZone);
      console.log('Current time (SP):', formatInTimeZone(zonedNow, timeZone, 'yyyy-MM-dd HH:mm:ss'));

      if (operations && operations.length > 0) {
        const lastOpTime = toZonedTime(new Date(operations[0].operated_at), timeZone);
        console.log('Found last operation time (SP):', formatInTimeZone(lastOpTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
        setLastOperationTime(lastOpTime);
      } else {
        // Se não houver operações, buscar a data de criação do investimento
        console.log('No operations found, fetching investment creation time...');
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
          const creationTime = toZonedTime(new Date(investment.created_at), timeZone);
          console.log('Using investment creation time (SP):', formatInTimeZone(creationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
          setLastOperationTime(creationTime);
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
      console.log('Fetching last operation time for investment:', investmentId);
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentId]);

  useEffect(() => {
    if (operationCompleted) {
      const now = new Date();
      const zonedNow = toZonedTime(now, timeZone);
      console.log('Operation completed, setting new last operation time (SP):', 
        formatInTimeZone(zonedNow, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      setLastOperationTime(zonedNow);
      setTimeLeft(30);
      setCanOperate(false);
    }
  }, [operationCompleted, timeZone]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime || isLoading) {
      setTimeLeft(30);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = toZonedTime(new Date(), timeZone);
      console.log('Calculating time left...');
      console.log('Current time (SP):', formatInTimeZone(now, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      console.log('Last operation/creation time (SP):', formatInTimeZone(lastOperationTime, timeZone, 'yyyy-MM-dd HH:mm:ss'));
      
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      console.log('Seconds passed since last operation:', secondsPassed);
      
      const remaining = Math.max(30 - secondsPassed, 0);
      console.log('Remaining seconds:', remaining);

      setTimeLeft(remaining);
      setCanOperate(secondsPassed >= 30);
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