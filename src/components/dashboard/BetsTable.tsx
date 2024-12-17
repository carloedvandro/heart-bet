import { Bet } from "@/integrations/supabase/custom-types";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { BetsTableActions } from "./BetsTableActions";
import { format } from "date-fns";
import { BetsTableContent } from "./BetsTableContent";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BetsTableProps {
  refreshTrigger?: number;
}

export function BetsTable({ refreshTrigger }: BetsTableProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [allBets, setAllBets] = useState<Bet[]>([]); 
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

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
        setAllBets(allData);
      }

      // Then fetch paginated data for display
      const { data, error, count } = await query
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) throw error;
      
      setBets(data || []);
      if (count) {
        setTotalItems(count);
        setHasMore(count > (currentPage + 1) * itemsPerPage);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, date, currentPage]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets, refreshTrigger]);

  const handleBetDeleted = useCallback(() => {
    fetchBets();
  }, [fetchBets]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <p className="text-center p-4">Carregando suas apostas...</p>;
  if (!session?.user?.id) return <p className="text-center p-4">Você precisa estar logado para ver suas apostas.</p>;

  return (
    <div className="space-y-4">
      <BetsTableActions 
        date={date}
        setDate={setDate}
        bets={allBets}
      />

      {bets.length === 0 ? (
        <p className="text-center p-4">
          {date ? "Nenhuma aposta encontrada para esta data." : "Você ainda não fez nenhuma aposta."}
        </p>
      ) : (
        <>
          <BetsTableContent 
            bets={bets} 
            onBetDeleted={handleBetDeleted}
          />
          
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {Math.ceil(totalItems / itemsPerPage)}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!hasMore}
                className="gap-2"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
