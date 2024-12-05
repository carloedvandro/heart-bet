import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bet } from "@/integrations/supabase/custom-types";

interface BetsTableProps {
  bets: Bet[];
  loading: boolean;
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

export function BetsTable({ bets, loading }: BetsTableProps) {
  if (loading) return <p>Carregando...</p>;
  if (bets.length === 0) return <p>Você ainda não fez nenhuma aposta.</p>;

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