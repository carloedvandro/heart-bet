import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetTableRow } from "./BetTableRow";
import BetReceipt from "../BetReceipt";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BetsTableContentProps {
  bets: Bet[];
}

interface GroupedBets {
  [key: string]: Bet[];
}

export function BetsTableContent({ bets: initialBets }: BetsTableContentProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [bets, setBets] = useState<Bet[]>(initialBets);
  const [groupedBets, setGroupedBets] = useState<GroupedBets>({});

  // Função para agrupar apostas por data
  const groupBets = (betsToGroup: Bet[]) => {
    const grouped: GroupedBets = {};
    
    betsToGroup.forEach((bet) => {
      const drawDate = new Date(bet.draw_date);
      drawDate.setMinutes(drawDate.getMinutes() + drawDate.getTimezoneOffset());
      const dateKey = format(drawDate, 'dd/MM/yyyy');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(bet);
    });

    const sortedGrouped: GroupedBets = {};
    Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      })
      .forEach(date => {
        sortedGrouped[date] = grouped[date];
      });

    setGroupedBets(sortedGrouped);
  };

  useEffect(() => {
    groupBets(bets);
  }, [bets]);

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
      {Object.entries(groupedBets).map(([date, dateBets]) => (
        <div key={date} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {date}
          </h3>
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
              {dateBets.map((bet) => (
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