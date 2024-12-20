import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetTableRow } from "./BetTableRow";
import BetReceipt from "../BetReceipt";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BetsTableContentProps {
  bets: Bet[];
}

interface GroupedBets {
  [key: string]: {
    [key: string]: Bet[];
  };
}

export function BetsTableContent({ bets: initialBets }: BetsTableContentProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [bets, setBets] = useState<Bet[]>(initialBets);
  const [groupedBets, setGroupedBets] = useState<GroupedBets>({});

  // Função para agrupar apostas por data e período
  const groupBets = (betsToGroup: Bet[]) => {
    const grouped: GroupedBets = {};
    
    betsToGroup.forEach((bet) => {
      const dateKey = format(new Date(bet.draw_date), 'dd/MM/yyyy');
      if (!grouped[dateKey]) {
        grouped[dateKey] = {};
      }
      if (!grouped[dateKey][bet.draw_period]) {
        grouped[dateKey][bet.draw_period] = [];
      }
      grouped[dateKey][bet.draw_period].push(bet);
    });

    setGroupedBets(grouped);
  };

  useEffect(() => {
    groupBets(bets);
  }, [bets]);

  // Configurar canal de tempo real para atualizações
  useEffect(() => {
    const channel = supabase
      .channel('active-bets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_bets_formatted'
        },
        async (payload) => {
          console.log('Realtime update received:', payload);
          
          // Atualizar lista de apostas
          const { data: updatedBets, error } = await supabase
            .from('bets')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && updatedBets) {
            setBets(updatedBets);
            console.log('Bets updated:', updatedBets);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (bets.length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(groupedBets).map(([date, periods]) => (
        <div key={date} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {date}
          </h3>
          {Object.entries(periods).map(([period, periodBets]) => (
            <div key={period} className="mb-6">
              <h4 className="text-md font-medium mb-2 text-gray-700">
                {period === 'morning' ? 'Manhã' :
                 period === 'afternoon' ? 'Tarde' :
                 period === 'evening' ? 'Noite' : 'Corujinha'}
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comprovante</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead>Sequência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Prêmio Potencial</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Prêmio</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodBets.map((bet) => (
                    <BetTableRow
                      key={bet.id}
                      bet={bet}
                      onViewReceipt={(bet) => setSelectedBet(bet)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      ))}

      <Dialog open={!!selectedBet} onOpenChange={() => setSelectedBet(null)}>
        <DialogContent className="max-w-3xl">
          {selectedBet && (
            <BetReceipt 
              bet={selectedBet} 
              onReset={() => setSelectedBet(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}