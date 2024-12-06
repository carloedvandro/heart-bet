import { Bet } from "@/integrations/supabase/custom-types";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { BetsTableActions } from "./BetsTableActions";
import { format } from "date-fns";
import { BetsTableContent } from "./BetsTableContent";

interface BetsTableProps {
  refreshTrigger?: number;
}

export function BetsTable({ refreshTrigger }: BetsTableProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from("bets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (date) {
        query = query.eq("draw_date", format(date, "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, date]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets, refreshTrigger]);

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