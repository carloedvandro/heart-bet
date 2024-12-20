import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ViewResultsDialog() {
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: results, isLoading } = useQuery({
    queryKey: ['lottery_results', formattedDate],
    queryFn: async () => {
      console.log('Fetching results for date:', formattedDate);
      
      const { data, error } = await supabase
        .from('lottery_results')
        .select('*')
        .eq('draw_date', formattedDate)
        .order('draw_period', { ascending: true })
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching results:', error);
        throw error;
      }

      console.log('Results received:', data);
      return data || [];
    },
    enabled: isOpen, // Only fetch when dialog is open
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const periods = ['morning', 'afternoon', 'night', 'late_night'];
  const periodLabels = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    night: 'Noite',
    late_night: 'Corujinha'
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Resultados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resultados do Dia</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-[200px,1fr]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                console.log('Date selected:', format(date, 'yyyy-MM-dd'));
                setDate(date);
              }
            }}
            className="rounded-md border"
            locale={ptBR}
          />

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Carregando resultados...</div>
            ) : !results || results.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum resultado encontrado para esta data
              </div>
            ) : (
              periods.map((period) => {
                const periodResults = results.filter(r => r.draw_period === period);
                
                if (!periodResults?.length) return null;

                return (
                  <Card key={period} className="p-4">
                    <h3 className="font-semibold mb-2">{periodLabels[period as keyof typeof periodLabels]}</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {periodResults.map((result) => (
                        <div key={result.id} className="text-center">
                          <div className="font-medium">{result.position}º</div>
                          <div className="text-2xl font-bold">{result.number}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.game_number} - {result.animal}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}