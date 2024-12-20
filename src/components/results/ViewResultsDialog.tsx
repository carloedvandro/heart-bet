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
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function ViewResultsDialog() {
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const formattedDate = format(date, 'yyyy-MM-dd');
  const displayDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const { data: results, isLoading, error } = useQuery({
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

      console.log('Raw results from database:', data);
      return data || [];
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Debug logs
  console.log('All periods available:', ['morning', 'afternoon', 'night', 'late_night']);
  console.log('Períodos disponíveis nos resultados:', results?.map(r => r.draw_period));
  console.log('Todos os resultados:', results);

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
      <DialogContent className="max-w-[95vw] w-full md:max-w-3xl h-[90vh] md:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl text-center">
            Resultados do Dia {displayDate}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-[200px,1fr]'}`}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                console.log('Date selected:', format(newDate, 'yyyy-MM-dd'));
                setDate(newDate);
              }
            }}
            className="rounded-md border shadow mx-auto"
            locale={ptBR}
            disabled={(date) => date > new Date()}
          />

          <div className="space-y-4">
            {error ? (
              <div className="text-center py-4 text-red-500">
                Erro ao carregar resultados. Tente novamente.
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                {periods.map((period) => (
                  <Skeleton key={period} className="h-32 w-full" />
                ))}
              </div>
            ) : !results || results.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum resultado encontrado para esta data
              </div>
            ) : (
              periods.map((period) => {
                const periodResults = results.filter(r => r.draw_period === period);
                console.log(`Resultados para ${period}:`, periodResults);
                
                if (!periodResults?.length) return null;

                return (
                  <Card key={period} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-3 text-lg text-center md:text-left">
                      {periodLabels[period as keyof typeof periodLabels]}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                      {periodResults.map((result) => (
                        <div 
                          key={result.id} 
                          className="text-center p-2 rounded-lg bg-muted/50"
                        >
                          <div className="font-medium text-sm text-muted-foreground">
                            {result.position}º
                          </div>
                          <div className="text-xl md:text-2xl font-bold my-1">
                            {result.number}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground">
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