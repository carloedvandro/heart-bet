import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Bet } from "@/integrations/supabase/custom-types";
import { generateBetsPDF } from "@/utils/pdfGenerator";

interface BetsTableActionsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  bets: Bet[];
}

export function BetsTableActions({ date, setDate, bets }: BetsTableActionsProps) {
  const handleDownloadPDF = () => {
    const doc = generateBetsPDF(bets, date);
    if (doc) {
      doc.save("extrato-apostas.pdf");
      toast.success("PDF baixado com sucesso!");
    } else {
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleSharePDF = async () => {
    try {
      const doc = generateBetsPDF(bets, date);
      if (!doc) return;

      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], "extrato-apostas.pdf", { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Extrato de Apostas',
          text: 'Confira meu extrato de apostas!'
        });
        toast.success("PDF compartilhado com sucesso!");
      } else {
        // Fallback para navegadores que não suportam Web Share API
        handleDownloadPDF();
        toast.info("Seu dispositivo não suporta compartilhamento direto. O PDF foi baixado.");
      }
    } catch (error) {
      console.error("Erro ao compartilhar PDF:", error);
      if (error instanceof Error && error.name === "NotAllowedError") {
        toast.error("Permissão negada para compartilhar. Tente baixar o PDF.");
      } else {
        toast.error("Erro ao compartilhar PDF");
      }
    }
  };

  return (
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
  );
}