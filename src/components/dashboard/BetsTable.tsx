import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bet } from "@/integrations/supabase/custom-types";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

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
  const session = useSession();

  const fetchBets = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error("Error fetching bets:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Initial bets fetch
  useEffect(() => {
    fetchBets();
  }, [fetchBets, refreshTrigger]);

  // Subscribe to bets changes
  useRealtimeSubscription({
    table: 'bets',
    filter: `user_id=eq.${session?.user?.id}`,
    onChanged: fetchBets,
    enabled: !!session?.user?.id
  });

  if (loading) return <p className="text-center p-4">Carregando suas apostas...</p>;
  if (!session?.user?.id) return <p className="text-center p-4">Você precisa estar logado para ver suas apostas.</p>;
  if (bets.length === 0) return <p className="text-center p-4">Você ainda não fez nenhuma aposta.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Período</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Números</TableHead>
          <TableHead>Valor</TableHead>
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
              {bet.numbers?.join(", ") || "N/A"}
            </TableCell>
            <TableCell>
              R$ {Number(bet.amount).toFixed(2)}
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
  );
}