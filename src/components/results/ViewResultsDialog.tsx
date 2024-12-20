import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ViewResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export function ViewResultsDialog({
  isOpen,
  onOpenChange,
  selectedDate,
}: ViewResultsDialogProps) {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["lottery-results", selectedDate],
    queryFn: async () => {
      console.log('Fetching results for date:', selectedDate);
      
      const { data, error } = await supabase
        .from("lottery_results")
        .select("*")
        .eq("draw_date", format(selectedDate, "yyyy-MM-dd"));

      if (error) {
        console.error('Error fetching results:', error);
        throw error;
      }

      console.log('Raw results from database:', data);
      return data || [];
    },
    enabled: isOpen,
    refetchOnMount: true,
    retry: 2,
  });

  // Debug logs
  console.log('All periods available:', ['morning', 'afternoon', 'night', 'late_night']);
  console.log('Períodos disponíveis nos resultados:', results?.map(r => r.draw_period));
  console.log('Resultados específicos para late_night:', results?.filter(r => r.draw_period === 'late_night'));
  console.log('Todos os resultados:', results);

  const periods = ['morning', 'afternoon', 'night', 'late_night'];
  const periodLabels = {
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    late_night: "Corujinha",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resultados da Loteria</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {periods.map(period => (
              <div key={period}>
                <h2>{periodLabels[period]}</h2>
                <ul>
                  {results
                    .filter(result => result.draw_period === period)
                    .map(result => (
                      <li key={result.id}>{result.result}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
