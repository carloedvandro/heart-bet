import { Bet } from "@/integrations/supabase/custom-types";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { format } from "date-fns";
import { Download, Receipt, Share2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { generateBetsPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { calculatePrize, Position } from "@/types/betting";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface BetReceiptProps {
  bet: Bet;
  onReset?: () => void;
}

const BetReceipt = ({ bet, onReset }: BetReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const doc = generateBetsPDF([bet]);
    if (doc) {
      doc.save(`comprovante-${bet.bet_number}.pdf`);
      toast.success("PDF baixado com sucesso!");
    } else {
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleShareReceipt = async () => {
    try {
      if (!receiptRef.current) return;

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: 'white',
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-receipt]');
          if (clonedElement) {
            clonedElement.scrollTop = 0;
          }
        }
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Erro ao gerar imagem do comprovante");
          return;
        }

        const file = new File([blob], `comprovante-${bet.bet_number}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Comprovante de Aposta',
              text: 'Confira meu comprovante de aposta!'
            });
            toast.success("Comprovante compartilhado com sucesso!");
          } catch (error) {
            console.error("Erro ao compartilhar:", error);
            // Se o usuário cancelar o compartilhamento, não mostrar erro
            if (error instanceof Error && error.name !== "AbortError") {
              toast.error("Erro ao compartilhar comprovante");
            }
          }
        } else {
          // Fallback para download se compartilhamento não for suportado
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
      }, 'image/png', 1.0);

    } catch (error) {
      console.error("Erro ao compartilhar comprovante:", error);
      toast.error("Erro ao compartilhar comprovante");
    }
  };

  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg animate-fade-in font-mono py-4 my-4" ref={receiptRef} data-receipt>
      <div className="text-center py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-lg">
        <h1 className="text-3xl font-bold text-white font-sans tracking-wider animate-pulse">
          Corações Premiados
        </h1>
      </div>
      
      <CardContent className="space-y-4 pt-6 border-x-2 border-dashed border-gray-200">
        <div className="text-center border-b-2 border-dashed border-gray-200 pb-4">
          <Receipt className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Comprovante de Aposta</p>
          <p className="text-lg font-bold">#{bet.bet_number}</p>
        </div>

        <div className="space-y-3 px-4">
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Data/Hora:</span>
            <span className="font-medium text-right flex-1 pl-2">
              {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
            </span>
          </div>
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Período:</span>
            <span className="font-medium text-right flex-1 pl-2">
              {getDrawPeriodName(bet.draw_period)}
            </span>
          </div>
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Tipo de Aposta:</span>
            <span className="font-medium text-right flex-1 pl-2">
              {getBetTypeName(bet.bet_type)}
            </span>
          </div>
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Posição:</span>
            <span className="font-medium text-right flex-1 pl-2">{bet.position}º</span>
          </div>
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Números:</span>
            <span className="font-medium text-right flex-1 pl-2 break-all">
              {bet.numbers.join(", ")}
            </span>
          </div>
          <div className="flex justify-between text-sm break-words">
            <span className="text-gray-600 min-w-[100px]">Valor:</span>
            <span className="font-medium text-right flex-1 pl-2">
              R$ {Number(bet.amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex justify-between items-center px-4">
            <span className="text-gray-600">Prêmio Potencial:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {potentialPrize.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-6 pt-4 border-t-2 border-dashed border-gray-200">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleShareReceipt}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
              Nova Aposta
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 pt-4 border-t-2 border-dashed border-gray-200">
          * Guarde este comprovante
        </div>
      </CardContent>
    </Card>
  );
};

export default BetReceipt;