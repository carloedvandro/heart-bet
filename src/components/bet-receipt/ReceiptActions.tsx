import { Download, Share2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { Bet } from "@/integrations/supabase/custom-types";
import { generateBetsPDF } from "@/utils/pdfGenerator";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReceiptActionsProps {
  bet: Bet;
  receiptRef: React.RefObject<HTMLDivElement>;
  onReset?: () => void;
}

const ReceiptActions = ({ bet, receiptRef, onReset }: ReceiptActionsProps) => {
  const isMobile = useIsMobile();

  const handleDownloadPDF = async () => {
    try {
      console.log("ReceiptActions - Starting PDF download");
      const doc = generateBetsPDF([bet]);
      if (doc) {
        doc.save(`comprovante-${bet.bet_number}.pdf`);
        toast.success("PDF baixado com sucesso!");
      } else {
        console.error("ReceiptActions - Failed to generate PDF");
        toast.error("Erro ao gerar PDF");
      }
    } catch (error) {
      console.error("ReceiptActions - Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleShareReceipt = async () => {
    try {
      console.log("ReceiptActions - Starting share process");
      
      if (!receiptRef.current) {
        console.error("ReceiptActions - Receipt ref is null");
        toast.error("Erro ao gerar imagem do comprovante");
        return;
      }

      console.log("ReceiptActions - Receipt dimensions:", {
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight
      });

      // Aguardar um momento para garantir que o DOM está totalmente renderizado
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aumentado para 1 segundo

      console.log("ReceiptActions - Starting html2canvas conversion");
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: true, // Ativado para debug
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight,
        onclone: (document, element) => {
          console.log("ReceiptActions - Cloning document for canvas");
          element.style.width = `${receiptRef.current?.offsetWidth}px`;
          element.style.height = `${receiptRef.current?.offsetHeight}px`;
          element.style.position = 'relative';
          element.style.transform = 'none';
        }
      });

      console.log("ReceiptActions - Canvas created successfully");

      const blob = await new Promise<Blob>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              console.log("ReceiptActions - Blob created successfully");
              resolve(blob);
            } else {
              console.error("ReceiptActions - Failed to create blob");
              reject(new Error("Erro ao gerar imagem"));
            }
          }, 'image/png', 1.0);
        } catch (error) {
          console.error("ReceiptActions - Error in blob creation:", error);
          reject(error);
        }
      });

      const file = new File([blob], `comprovante-${bet.bet_number}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          console.log("ReceiptActions - Starting native share");
          await navigator.share({
            files: [file],
            title: 'Comprovante de Aposta',
            text: 'Confira meu comprovante de aposta!'
          });
          toast.success("Comprovante compartilhado com sucesso!");
        } catch (error) {
          console.error("ReceiptActions - Share error:", error);
          if (error instanceof Error && error.name !== "AbortError") {
            // Fallback para download direto
            console.log("ReceiptActions - Falling back to direct download");
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
        console.log("ReceiptActions - Web Share API not supported, downloading directly");
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
      console.error("ReceiptActions - Error in share process:", error);
      toast.error("Erro ao compartilhar comprovante");
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-dashed border-gray-200 px-3">
      <Button
        variant="outline"
        onClick={handleDownloadPDF}
        className={`flex items-center justify-center gap-2 ${isMobile ? 'text-xs h-7' : 'text-xs h-8'}`}
      >
        <Download className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
        Baixar PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleShareReceipt}
        className={`flex items-center justify-center gap-2 ${isMobile ? 'text-xs h-7' : 'text-xs h-8'}`}
      >
        <Share2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
        Compartilhar
      </Button>
      {onReset && (
        <Button
          variant="outline"
          onClick={onReset}
          className={`flex items-center justify-center gap-2 ${isMobile ? 'text-xs h-7' : 'text-xs h-8'}`}
        >
          <RotateCcw className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          Nova Aposta
        </Button>
      )}
    </div>
  );
};

export default ReceiptActions;
