import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { BetsTableActions } from "./BetsTableActions";
import { BetsTableContent } from "./BetsTableContent";
import { BetsPagination } from "./BetsPagination";
import { useBetsFetch } from "@/hooks/useBetsFetch";

interface BetsTableProps {
  refreshTrigger?: number;
}

export function BetsTable({ refreshTrigger }: BetsTableProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const session = useSession();

  const {
    bets,
    allBets,
    loading,
    hasMore,
    totalItems,
    fetchBets
  } = useBetsFetch(date, currentPage, itemsPerPage);

  // Fetch bets when page changes or when refresh is triggered
  useEffect(() => {
    if (session?.user?.id) {
      console.log("Fetching bets due to page change or refresh:", {
        currentPage: currentPage + 1,
        refreshTrigger
      });
      fetchBets();
    }
  }, [currentPage, refreshTrigger, session?.user?.id, fetchBets]);

  const handleNextPage = () => {
    if (hasMore) {
      console.log("Moving to next page:", currentPage + 2);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      console.log("Moving to previous page:", currentPage);
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
          <BetsTableContent bets={bets} />
          
          <BetsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </>
      )}
    </div>
  );
}