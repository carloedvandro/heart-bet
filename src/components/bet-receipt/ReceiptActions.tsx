import { Download, Share2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { Bet } from "@/integrations/supabase/custom-types";
import { generateBetsPDF } from "@/utils/pdfGenerator";

interface ReceiptActionsProps {
  bet: Bet;
  receiptRef: React.RefObject<HTMLDivElement>;
  onReset?: () => void;
}

const ReceiptActions = ({ bet, receiptRef, onReset }: ReceiptActionsProps) => {
  const handleDownloadPDF = () => {
    try {
      const doc = generateBetsPDF([bet]);
      if (doc) {
        doc.save(`comprovante-${bet.bet_number}.pdf`);
        toast.success("PDF baixado com sucesso!");
      } else {
        toast.error("Erro ao gerar PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleShareReceipt = async () => {
    try {
      if (!receiptRef.current) {
        toast.error("Erro ao gerar imagem do comprovante");
        return;
      }

      // Aguardar um momento para garantir que o DOM está totalmente renderizado
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight,
        onclone: (_, element) => {
          element.style.width = `${receiptRef.current?.offsetWidth}px`;
          element.style.height = `${receiptRef.current?.offsetHeight}px`;
          element.style.position = 'relative';
          element.style.transform = 'none';
        }
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error("Erro ao gerar imagem");
          }
        }, 'image/png', 1.0);
      });

      const file = new File([blob], `comprovante-${bet.bet_number}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Comprovante de Aposta',
            text: 'Confira meu comprovante de aposta!'
          });
          toast.success("Comprovante compartilhado com sucesso!");
        } catch (error) {
          console.error("Erro ao compartilhar:", error);
          if (error instanceof Error && error.name !== "AbortError") {
            // Fallback para download direto em caso de erro no compartilhamento
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comprovante-${bet.bet_number}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.info("Não foi possível compartilhar. O arquivo foi baixado.");
          }
        }
      } else {
        // Fallback para navegadores que não suportam Web Share API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprovante-${bet.bet_number}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.info("Seu dispositivo não suporta compartilhamento direto. A imagem foi baixada.");
      }
    } catch (error) {
      console.error("Erro ao compartilhar comprovante:", error);
      toast.error("Erro ao compartilhar comprovante");
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-dashed border-gray-200 px-3">
      <Button
        variant="outline"
        onClick={handleDownloadPDF}
        className="flex items-center justify-center gap-2 text-xs h-8"
      >
        <Download className="w-4 h-4" />
        Baixar PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleShareReceipt}
        className="flex items-center justify-center gap-2 text-xs h-8"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </Button>
      {onReset && (
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center justify-center gap-2 text-xs h-8"
        >
          <RotateCcw className="w-4 h-4" />
          Nova Aposta
        </Button>
      )}
    </div>
  );
};

export default ReceiptActions;