import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

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
  onDateSelect: (date: Date) => void;
  bets: DailyBet[];
  selectedDate: Date | undefined;
}

export function DailyBetsList({ 
  open, 
  onOpenChange, 
  bets, 
  onDateSelect,
  selectedDate 
}: DailyBetsListProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apostas do Dia</DialogTitle>
          <DialogDescription>
            Selecione uma data para ver as apostas
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            locale={ptBR}
            className="rounded-md border"
          />

          {selectedDate && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhuma aposta encontrada para esta data
                    </TableCell>
                  </TableRow>
                ) : (
                  bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>{bet.profiles?.email || "Email não disponível"}</TableCell>
                      <TableCell>R$ {bet.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(bet.created_at), "HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}