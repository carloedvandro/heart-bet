import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BetsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function BetsPagination({
  currentPage,
  totalPages,
  hasMore,
  onNextPage,
  onPreviousPage
}: BetsPaginationProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-muted-foreground">
        Página {currentPage + 1} de {totalPages}
      </div>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onPreviousPage}
          disabled={currentPage === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={onNextPage}
          disabled={!hasMore}
          className="gap-2"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}