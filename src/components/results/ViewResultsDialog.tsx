import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export function ViewResultsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate] = useState(new Date());

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
  console.log('All periods available:', ['morning', 'afternoon', 'night']);
  console.log('Períodos disponíveis nos resultados:', results?.map(r => r.draw_period));
  console.log('Todos os resultados:', results);

  const periods = ['morning', 'afternoon', 'night'] as const;
  const periodLabels = {
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Resultados</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resultados da Loteria</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {periods.map(period => (
              <div key={period} className="mb-4">
                <h2 className="text-lg font-semibold mb-2">{periodLabels[period]}</h2>
                <ul className="space-y-1">
                  {results
                    .filter(result => result.draw_period === period)
                    .map(result => (
                      <li key={result.id} className="text-sm">
                        {result.number || 'N/A'}
                      </li>
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