import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateFilter } from "@/components/dashboard/table-actions/DateFilter";
import { BetType } from "@/types/betting";

const betTypes: { value: BetType; label: string }[] = [
  { value: "simple_group", label: "Grupo Simples" },
  { value: "dozen", label: "Dezena" },
  { value: "hundred", label: "Centena" },
  { value: "thousand", label: "Milhar" },
  { value: "group_double", label: "Grupo Duplo" },
  { value: "group_triple", label: "Grupo Triplo" },
];

export function AdminBetsList() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBetType, setSelectedBetType] = useState<BetType | "all">("all");

  const { data: betsData, isLoading } = useQuery({
    queryKey: ["admin", "detailed-bets", selectedDate, selectedBetType],
    queryFn: async () => {
      const today = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      let query = supabase
        .from("bets")
        .select(`
          *,
          profiles:profiles(email)
        `)
        .eq("draw_date", today);

      if (selectedBetType !== "all") {
        query = query.eq("bet_type", selectedBetType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar apostas:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <DateFilter date={selectedDate} setDate={setSelectedDate} />
        
        <Select
          value={selectedBetType}
          onValueChange={(value) => setSelectedBetType(value as BetType | "all")}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Filtrar por tipo de aposta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {betTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Horário</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Números</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : betsData && betsData.length > 0 ? (
              betsData.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>
                    {format(new Date(bet.created_at), "HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{(bet.profiles as any)?.email}</TableCell>
                  <TableCell>
                    {betTypes.find((type) => type.value === bet.bet_type)?.label}
                  </TableCell>
                  <TableCell>{bet.numbers.join(", ")}</TableCell>
                  <TableCell>R$ {Number(bet.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    {bet.is_winner === true
                      ? "Vencedor"
                      : bet.is_winner === false
                      ? "Não vencedor"
                      : "Pendente"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma aposta encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}