import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface DailyBet {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    email: string | null;
  };
}

interface DailyBetsListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bets: DailyBet[];
}

export function DailyBetsList({ open, onOpenChange, bets }: DailyBetsListProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apostas do Dia</DialogTitle>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Horário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{bet.profiles?.email || "Email não disponível"}</TableCell>
                <TableCell>R$ {bet.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(bet.created_at), "HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}