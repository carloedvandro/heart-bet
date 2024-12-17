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
  const [timeLeft, setTimeLeft] = useState<number>(120); // 120 segundos
  const [canOperate, setCanOperate] = useState(false);
  const timeZone = 'America/Sao_Paulo';
  const [lastOperationTime, setLastOperationTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the last operation time from the database
  useEffect(() => {
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
          // Se não houver operações anteriores, use a data de criação do investimento
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

    if (isEnabled && investmentId) {
      fetchLastOperationTime();
    }
  }, [isEnabled, investmentId, timeZone]);

  useEffect(() => {
    if (!isEnabled || !lastOperationTime || isLoading) {
      setTimeLeft(120); // Resetar para 120 segundos
      setCanOperate(false);
      return;
    }

    // When operation is completed, update the last operation time
    if (operationCompleted) {
      const now = toZonedTime(new Date(), timeZone);
      setLastOperationTime(now);
      setTimeLeft(120);
      setCanOperate(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = toZonedTime(new Date(), timeZone);
      const secondsPassed = differenceInSeconds(now, lastOperationTime);
      const remaining = Math.max(120 - secondsPassed, 0); // 120 segundos, não permite valores negativos

      if (secondsPassed >= 120) {
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
  }, [isEnabled, operationCompleted, lastOperationTime, timeZone, isLoading]);

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Carregando cronômetro...
        </div>
      ) : !canOperate ? (
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