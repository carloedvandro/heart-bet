import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bet } from "@/integrations/supabase/custom-types";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text("Extrato de Apostas", 14, 22);
      
      // Subtítulo com data
      doc.setFontSize(12);
      doc.text(
        date ? 
          `Data: ${format(date, "dd/MM/yyyy")}` : 
          "Todas as apostas",
        14, 32
      );

      // Tabela
      autoTable(doc, {
        head: [["Data", "Período", "Tipo", "Posição", "Números", "Valor", "Resultado", "Prêmio"]],
        body: bets.map((bet) => [
          format(new Date(bet.created_at), "dd/MM/yyyy"),
          getDrawPeriodName(bet.draw_period),
          getBetTypeName(bet.bet_type),
          bet.position + "º",
          bet.numbers?.join(", ") || "N/A",
          `R$ ${Number(bet.amount).toFixed(2)}`,
          bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando",
          bet.prize_amount ? 
            `R$ ${Number(bet.prize_amount).toFixed(2)}` : 
            bet.is_winner === false ? "Não premiado" : "Pendente",
        ]),
        startY: 40,
      });

      return doc;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
      return null;
    }
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    if (doc) {
      doc.save("extrato-apostas.pdf");
      toast.success("PDF baixado com sucesso!");
    }
  };

  const handleSharePDF = async () => {
    try {
      const doc = generatePDF();
      if (!doc) return;

      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], "extrato-apostas.pdf", { type: "application/pdf" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Extrato de Apostas',
          text: 'Confira meu extrato de apostas!'
        });
        toast.success("PDF compartilhado com sucesso!");
      } else {
        // Fallback para navegadores que não suportam Web Share API
        handleDownloadPDF();
      }
    } catch (error) {
      console.error("Erro ao compartilhar PDF:", error);
      toast.error("Erro ao compartilhar PDF");
    }
  };

  if (loading) return <p className="text-center p-4">Carregando suas apostas...</p>;
  if (!session?.user?.id) return <p className="text-center p-4">Você precisa estar logado para ver suas apostas.</p>;
  if (bets.length === 0) return <p className="text-center p-4">Você ainda não fez nenhuma aposta.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Filtrar por data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button 
              variant="ghost" 
              onClick={() => setDate(undefined)}
            >
              Limpar filtro
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleSharePDF}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Posição</TableHead>
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
                {bet.position}º
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
    </div>
  );
}