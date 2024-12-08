import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export const DateFilter = ({ date, setDate }: DateFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Filtrar por data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button 
          variant="ghost" 
          onClick={() => setDate(undefined)}
        >
          Limpar filtro
        </Button>
      )}
    </div>
  );
};