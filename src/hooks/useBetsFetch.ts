import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Bet } from "@/integrations/supabase/custom-types";
import { format } from "date-fns";

export function useBetsFetch(date: Date | undefined) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      console.log("Fetching all bets for date:", date ? format(date, "yyyy-MM-dd") : "all");

      let query = supabase
        .from("bets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (date) {
        query = query.eq("draw_date", format(date, "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bets:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched bets:", data.length);
        setBets(data);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, date]);

  return {
    bets,
    loading,
    fetchBets
  };
}