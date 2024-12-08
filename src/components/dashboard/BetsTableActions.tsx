import { Bet } from "@/integrations/supabase/custom-types";
import { PDFActions } from "./table-actions/PDFActions";
import { DateFilter } from "./table-actions/DateFilter";

interface BetsTableActionsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  bets: Bet[];
}

export function BetsTableActions({ date, setDate, bets }: BetsTableActionsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <DateFilter date={date} setDate={setDate} />
      <PDFActions bets={bets} date={date} />
    </div>
  );
}