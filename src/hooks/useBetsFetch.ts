import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Bet } from "@/integrations/supabase/custom-types";
import { format } from "date-fns";

export function useBetsFetch(date: Date | undefined, currentPage: number, itemsPerPage: number) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [allBets, setAllBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      console.log("Fetching bets with params:", {
        currentPage,
        itemsPerPage,
        date: date ? format(date, "yyyy-MM-dd") : "all"
      });

      let query = supabase
        .from("bets")
        .select("*", { count: 'exact' })
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (date) {
        query = query.eq("draw_date", format(date, "yyyy-MM-dd"));
      }

      // First fetch all bets for PDF generation
      const { data: allData } = await query;
      if (allData) {
        console.log("Fetched all bets:", allData.length);
        setAllBets(allData);
      }

      // Then fetch paginated data for display
      const startRow = currentPage * itemsPerPage;
      
      console.log("Pagination details:", {
        page: currentPage + 1,
        startRow,
        itemsPerPage
      });
      
      const { data, error, count } = await query
        .range(startRow, startRow + itemsPerPage - 1);

      if (error) {
        console.error("Error fetching bets:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched paginated bets:", {
          page: currentPage + 1,
          startRow,
          endRow: startRow + itemsPerPage - 1,
          totalCount: count,
          fetchedCount: data.length,
          items: data
        });
        
        setBets(data);
        
        if (count !== null) {
          console.log("Total items:", count);
          setTotalItems(count);
          setHasMore((currentPage + 1) * itemsPerPage < count);
        }
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, date, currentPage, itemsPerPage]);

  return {
    bets,
    allBets,
    loading,
    hasMore,
    totalItems,
    fetchBets
  };
}