import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import { BetTableRow } from "./BetTableRow";
import BetReceipt from "../BetReceipt";

interface BetsTableContentProps {
  bets: Bet[];
  onBetDeleted?: () => void;
}

export function BetsTableContent({ bets, onBetDeleted }: BetsTableContentProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);

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
              onBetDeleted={onBetDeleted}
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