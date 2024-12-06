import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bet } from "@/integrations/supabase/custom-types";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { BetsTableActions } from "./BetsTableActions";
import { format } from "date-fns";
import { calculatePrize } from "@/types/betting";

interface BetsTableProps {
  refreshTrigger?: number;
}

const getBetTypeName = (type: string): string => {
  const names: Record<string, string> = {
    simple_group: "Grupo Simples",
    dozen: "Dezena",
    hundred: "Centena",
    thousand: "Milhar",
    group_double: "Duque de Grupo",
    group_triple: "Terno de Grupo",
  };
  return names[type] || type;
};

const getDrawPeriodName = (period: string): string => {
  const names: Record<string, string> = {
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
    night: "Corujinha",
  };
  return names[period] || period;
};

export function BetsTable({ refreshTrigger }: BetsTableProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from("bets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (date) {
        query = query.eq("draw_date", format(date, "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, date]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets, refreshTrigger]);

  if (loading) return <p className="text-center p-4">Carregando suas apostas...</p>;
  if (!session?.user?.id) return <p className="text-center p-4">Você precisa estar logado para ver suas apostas.</p>;

  return (
    <div className="space-y-4">
      <BetsTableActions 
        date={date}
        setDate={setDate}
        bets={bets}
      />

      {bets.length === 0 ? (
        <p className="text-center p-4">
          {date ? "Nenhuma aposta encontrada para esta data." : "Você ainda não fez nenhuma aposta."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead>Números</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Prêmio Potencial</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Prêmio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>
                  {new Date(bet.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {getDrawPeriodName(bet.draw_period)}
                </TableCell>
                <TableCell>
                  {getBetTypeName(bet.bet_type)}
                </TableCell>
                <TableCell>
                  {bet.position}º
                </TableCell>
                <TableCell>
                  {bet.numbers?.join(", ") || "N/A"}
                </TableCell>
                <TableCell>
                  R$ {Number(bet.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  R$ {calculatePrize(bet.bet_type, bet.position, Number(bet.amount)).toFixed(2)}
                </TableCell>
                <TableCell>
                  {bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando sorteio"}
                </TableCell>
                <TableCell>
                  {bet.prize_amount ? (
                    <span className="text-green-600 font-medium">
                      R$ {Number(bet.prize_amount).toFixed(2)}
                    </span>
                  ) : bet.is_winner === false ? (
                    <span className="text-red-600 font-medium">Não premiado</span>
                  ) : (
                    "Pendente"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}