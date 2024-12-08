import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Bet } from "@/integrations/supabase/custom-types";
import { generateBetsPDF } from "@/utils/pdfGenerator";

interface PDFActionsProps {
  bets: Bet[];
  date?: Date;
}

export const PDFActions = ({ bets, date }: PDFActionsProps) => {
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
  );
};