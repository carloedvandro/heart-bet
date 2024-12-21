import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetTableRow } from "./BetTableRow";
import BetReceipt from "../BetReceipt";
import { supabase } from "@/integrations/supabase/client";

interface BetsTableContentProps {
  bets: Bet[];
}

export function BetsTableContent({ bets: initialBets }: BetsTableContentProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [bets, setBets] = useState<Bet[]>(initialBets);

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
          {bets.map((bet) => (
            <BetTableRow
              key={bet.id}
              bet={bet}
              onViewReceipt={(bet) => setSelectedBet(bet)}
            />
          ))}
        </TableBody>
      </Table>

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