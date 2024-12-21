import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { BetsTableActions } from "./BetsTableActions";
import { BetsTableContent } from "./BetsTableContent";
import { useBetsFetch } from "@/hooks/useBetsFetch";

interface BetsTableProps {
  refreshTrigger?: number;
}

export function BetsTable({ refreshTrigger }: BetsTableProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const session = useSession();
  const { bets, loading, fetchBets } = useBetsFetch(date);

  // Fetch bets when date changes or when refresh is triggered
  useEffect(() => {
    if (session?.user?.id) {
      console.log("Fetching bets due to date change or refresh");
      fetchBets();
    }
  }, [date, refreshTrigger, session?.user?.id, fetchBets]);

  if (loading) return <p className="text-center p-4">Carregando suas apostas...</p>;
  if (!session?.user?.id) return <p className="text-center p-4">Você precisa estar logado para ver suas apostas.</p>;

  return (
    <div className="space-y-4">
      <BetsTableActions 
        date={date}
        setDate={setDate}
        bets={bets}
      />

      {bets.length === 0 ? (
        <p className="text-center p-4">
          {date ? "Nenhuma aposta encontrada para esta data." : "Você ainda não fez nenhuma aposta."}
        </p>
      ) : (
        <BetsTableContent bets={bets} />
      )}
    </div>
  );
}