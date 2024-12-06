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
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: receiptRef.current.offsetWidth,
        windowHeight: receiptRef.current.offsetHeight
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Erro ao gerar imagem do comprovante");
          return;
        }

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
            // Se o usuário cancelar o compartilhamento, não mostrar erro
            if (error instanceof Error && error.name !== "AbortError") {
              toast.error("Erro ao compartilhar comprovante");
            }
          }
        } else {
          // Fallback para download direto se o compartilhamento não for suportado
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
    <Card className="w-full bg-white shadow-lg animate-fade-in font-mono" ref={receiptRef} data-receipt>
      <div className="text-center py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-sans tracking-wider animate-pulse">
          Corações Premiados
        </h1>
      </div>
      
      <CardContent className="space-y-3 p-0">
        <div className="text-center border-b border-dashed border-gray-200 pb-3">
          <Receipt className="w-6 h-6 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Comprovante de Aposta</p>
          <p className="text-base font-bold">#{bet.bet_number}</p>
        </div>

        <div className="space-y-2 px-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Data/Hora:</span>
            <span className="font-medium text-right flex-1 break-words">
              {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Período:</span>
            <span className="font-medium text-right flex-1 break-words">
              {getDrawPeriodName(bet.draw_period)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Tipo de Aposta:</span>
            <span className="font-medium text-right flex-1 break-words">
              {getBetTypeName(bet.bet_type)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Posição:</span>
            <span className="font-medium text-right flex-1">{bet.position}º</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Números:</span>
            <span className="font-medium text-right flex-1 break-all">
              {bet.numbers.join(", ")}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 min-w-[100px]">Valor:</span>
            <span className="font-medium text-right flex-1">
              R$ {Number(bet.amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-dashed border-gray-200 px-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Prêmio Potencial:</span>
            <span className="text-lg font-bold text-green-600">
              R$ {potentialPrize.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-dashed border-gray-200 px-4">
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

        <div className="text-center text-[10px] text-gray-500 pt-2 border-t border-dashed border-gray-200 px-4 pb-4">
          * Guarde este comprovante
        </div>
      </CardContent>
    </Card>
  );
};

export default BetReceipt;