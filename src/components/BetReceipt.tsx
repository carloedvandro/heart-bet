import { Bet } from "@/integrations/supabase/custom-types";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { format } from "date-fns";
import { Download, Receipt, Share2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { generateBetsPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { calculatePrize, Position } from "@/types/betting";

interface BetReceiptProps {
  bet: Bet;
  onReset?: () => void;
}

const BetReceipt = ({ bet, onReset }: BetReceiptProps) => {
  const handleDownloadPDF = () => {
    const doc = generateBetsPDF([bet]);
    if (doc) {
      doc.save(`comprovante-${bet.bet_number}.pdf`);
      toast.success("PDF baixado com sucesso!");
    } else {
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleSharePDF = async () => {
    try {
      const doc = generateBetsPDF([bet]);
      if (!doc) return;

      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], `comprovante-${bet.bet_number}.pdf`, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Comprovante de Aposta',
          text: 'Confira meu comprovante de aposta!'
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

  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg animate-fade-in font-mono">
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
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Data/Hora:</span>
            <span className="font-medium">{format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Período:</span>
            <span className="font-medium">{getDrawPeriodName(bet.draw_period)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tipo de Aposta:</span>
            <span className="font-medium">{getBetTypeName(bet.bet_type)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Posição:</span>
            <span className="font-medium">{bet.position}º</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Números:</span>
            <span className="font-medium">{bet.numbers.join(", ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Valor:</span>
            <span className="font-medium">R$ {Number(bet.amount).toFixed(2)}</span>
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
            onClick={handleSharePDF}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
            Nova Aposta
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 pt-4 border-t-2 border-dashed border-gray-200">
          * Guarde este comprovante
        </div>
      </CardContent>
    </Card>
  );
};

export default BetReceipt;