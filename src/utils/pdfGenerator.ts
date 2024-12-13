import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bet } from "@/integrations/supabase/custom-types";
import { getBetTypeName, getDrawPeriodName } from "./betFormatters";
import { calculatePrize, Position } from "@/types/betting";

export const generateBetsPDF = (bets: Bet[], date?: Date) => {
  try {
    // Create PDF in landscape mode
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Title
    doc.setFontSize(20);
    doc.text("Extrato de Apostas", 14, 22);
    
    // Subtitle with date
    doc.setFontSize(12);
    doc.text(
      date ? 
        `Data: ${format(date, "dd/MM/yyyy")}` : 
        "Todas as apostas",
      14, 32
    );

    // Function to format bet sequence
    const formatBetSequence = (bet: Bet) => {
      if (!bet.numbers?.length) return "N/A";

      if (bet.bet_type === 'dozen' || bet.bet_type === 'hundred' || bet.bet_type === 'thousand') {
        return bet.numbers.join("");
      }

      return bet.numbers.map(num => num.toString().padStart(2, '0')).join(", ");
    };

    // Table configuration with automatic pagination
    autoTable(doc, {
      head: [["Comprovante", "Data/Hora", "Período", "Tipo", "Posição", "Sequência", "Valor", "Prêmio Potencial", "Resultado", "Prêmio"]],
      body: bets.map((bet) => [
        bet.bet_number || "N/A",
        format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss"),
        getDrawPeriodName(bet.draw_period),
        getBetTypeName(bet.bet_type),
        bet.position === 5 ? "1º ao 5º" : `${bet.position}º`,
        formatBetSequence(bet),
        `R$ ${Number(bet.amount).toFixed(2)}`,
        `R$ ${calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount)).toFixed(2)}`,
        bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando",
        bet.prize_amount ? 
          `R$ ${Number(bet.prize_amount).toFixed(2)}` : 
          bet.is_winner === false ? "Não premiado" : "Pendente",
      ]),
      startY: 40,
      margin: { top: 40, right: 14, bottom: 20, left: 14 },
      didDrawPage: function(data) {
        doc.setFontSize(10);
        doc.text(
          `Página ${data.pageNumber}`,
          data.settings.margin.left,
          15
        );
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 },
        7: { cellWidth: 30 },
        8: { cellWidth: 30 },
        9: { cellWidth: 25 },
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2,
        fontSize: 8,
      },
      showFoot: 'lastPage',
      showHead: 'everyPage',
    });

    return doc;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return null;
  }
};