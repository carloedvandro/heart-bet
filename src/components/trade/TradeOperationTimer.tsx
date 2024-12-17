import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { differenceInSeconds } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
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
  // Change timer to 24 hours (86400 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(86400); 
  const [canOperate, setCanOperate] = useState(false);
  const timeZone = 'America/Sao_Paulo';
  const [lastOperationTime, setLastOperationTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastOperationTime = async () => {
    try {
      setIsLoading(true);
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

      if (operations && operations.length > 0) {
        const lastOpTime = toZonedTime(new Date(operations[0].operated_at), timeZone);
        console.log('Last operation time:', lastOpTime);
        setLastOperationTime(lastOpTime);
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
          const creationTime = toZonedTime(new Date(investment.created_at), timeZone);
          console.log('Investment creation time:', creationTime);
          setLastOperationTime(creationTime);
        }
      }
    } catch (error) {
      console.error('Error in fetchLastOperationTime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar o tempo quando o componente montar e quando isEnabled mudar
  useEffect(() => {
    if (isEnabled && investmentId) {
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentId]);

  // Atualizar o tempo quando uma operação for completada
  useEffect(() => {
    if (operationCompleted) {
      const now = toZonedTime(new Date(), timeZone);
      setLastOperationTime(now);
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
      const now = toZonedTime(new Date(), timeZone);
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = Math.max(86400 - secondsPassed, 0);

      if (secondsPassed >= 86400) {
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
  }, [isEnabled, lastOperationTime, timeZone, isLoading]);

  if (!isEnabled) return null;

  // Format time to show hours, minutes, and seconds
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