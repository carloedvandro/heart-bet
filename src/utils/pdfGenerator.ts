import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bet } from "@/integrations/supabase/custom-types";
import { getBetTypeName, getDrawPeriodName } from "./betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { getNumberForHeart } from "./heartNumberMapping";

export const generateBetsPDF = (bets: Bet[], date?: Date) => {
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

    // Função para formatar a sequência de apostas
    const formatBetSequence = (bet: Bet) => {
      if ((bet.bet_type === 'dozen' || bet.bet_type === 'hundred' || bet.bet_type === 'thousand') && bet.hearts?.length) {
        const numbers = bet.hearts.map(heart => {
          const num = getNumberForHeart(heart);
          // Para dezena, manter o formato com dois dígitos
          if (bet.bet_type === 'dozen') {
            return num.toString().padStart(2, '0');
          }
          // Para centena e milhar, não usar padStart
          return num.toString();
        });
        return numbers.join("");
      }

      if (bet.bet_type === 'simple_group' && bet.numbers?.length) {
        return bet.numbers.map(num => num.toString().padStart(2, '0')).join(", ");
      }

      if (bet.hearts?.length) {
        return bet.hearts.join(", ");
      }

      return "N/A";
    };

    // Tabela
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
    });

    return doc;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return null;
  }
};