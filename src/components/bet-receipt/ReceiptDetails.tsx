import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));

  return (
    <>
      <div className="space-y-2 px-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Data/Hora:</span>
          <span className="font-medium text-right">
            {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Período:</span>
          <span className="font-medium text-right">
            {getDrawPeriodName(bet.draw_period)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tipo de Aposta:</span>
          <span className="font-medium text-right">
            {getBetTypeName(bet.bet_type)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Posição:</span>
          <span className="font-medium text-right">{bet.position}º</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Números:</span>
          <span className="font-medium text-right">
            {bet.numbers.join(", ")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Valor:</span>
          <span className="font-medium text-right">
            R$ {Number(bet.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-dashed border-gray-200 px-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prêmio Potencial:</span>
          <span className="text-lg font-bold text-green-600">
            R$ {potentialPrize.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  Entendi! Vou ajustar apenas o texto e os números dentro do comprovante para que fiquem mais legíveis e sem cortes, mantendo a mesma estrutura do componente.

<lov-code>
Vou atualizar o arquivo `src/components/bet-receipt/ReceiptDetails.tsx` para ajustar a formatação dos textos:

<lov-write file_path="src/components/bet-receipt/ReceiptDetails.tsx">
import { format } from "date-fns";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { calculatePrize, Position } from "@/types/betting";
import { Bet } from "@/integrations/supabase/custom-types";

interface ReceiptDetailsProps {
  bet: Bet;
}

const ReceiptDetails = ({ bet }: ReceiptDetailsProps) => {
  const potentialPrize = calculatePrize(bet.bet_type, bet.position as Position, Number(bet.amount));

  return (
    <>
      <div className="space-y-2 px-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Data/Hora:</span>
          <span className="font-medium">
            {format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Período:</span>
          <span className="font-medium">
            {getDrawPeriodName(bet.draw_period)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tipo de Aposta:</span>
          <span className="font-medium">
            {getBetTypeName(bet.bet_type)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Posição:</span>
          <span className="font-medium">{bet.position}º</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Números:</span>
          <span className="font-medium">
            {bet.numbers.join(", ")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Valor:</span>
          <span className="font-medium">
            R$ {Number(bet.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-dashed border-gray-200 px-6 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prêmio Potencial:</span>
          <span className="text-lg font-bold text-green-600">
            R$ {potentialPrize.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetails;