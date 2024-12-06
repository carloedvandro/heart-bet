import { Download, Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Bet } from "@/integrations/supabase/custom-types";
import { generateBetsPDF } from "@/utils/pdfGenerator";
import { captureReceipt, shareReceipt } from "@/utils/receiptSharing";
import ActionButton from "./receipt-actions/ActionButton";

interface ReceiptActionsProps {
  bet: Bet;
  receiptRef: React.RefObject<HTMLDivElement>;
  onReset?: () => void;
}

const ReceiptActions = ({ bet, receiptRef, onReset }: ReceiptActionsProps) => {
  const handleDownloadPDF = async () => {
    try {
      console.log("Starting PDF download");
      const doc = generateBetsPDF([bet]);
      if (doc) {
        doc.save(`comprovante-${bet.bet_number}.pdf`);
        toast.success("PDF baixado com sucesso!");
      } else {
        console.error("Failed to generate PDF");
        toast.error("Erro ao gerar PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleShareReceipt = async () => {
    try {
      console.log("Starting share process");
      const canvas = await captureReceipt(receiptRef);
      console.log("Canvas created successfully");

      const blob = await new Promise<Blob>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              console.log("Blob created successfully");
              resolve(blob);
            } else {
              console.error("Failed to create blob");
              reject(new Error("Erro ao gerar imagem"));
            }
          }, 'image/png', 1.0);
        } catch (error) {
          console.error("Error in blob creation:", error);
          reject(error);
        }
      });

      await shareReceipt(blob, bet.bet_number || '');
      toast.success("Comprovante compartilhado com sucesso!");
    } catch (error) {
      console.error("Error in share process:", error);
      toast.error("Erro ao compartilhar comprovante");
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-dashed border-gray-200 px-3">
      <ActionButton
        icon={Download}
        label="Baixar PDF"
        onClick={handleDownloadPDF}
      />
      <ActionButton
        icon={Share2}
        label="Compartilhar"
        onClick={handleShareReceipt}
      />
      {onReset && (
        <ActionButton
          icon={RotateCcw}
          label="Nova Aposta"
          onClick={onReset}
        />
      )}
    </div>
  );
};

export default ReceiptActions;