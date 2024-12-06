import { Bet } from "@/integrations/supabase/custom-types";
import { getBetTypeName, getDrawPeriodName } from "@/utils/betFormatters";
import { format } from "date-fns";
import { Receipt } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface BetReceiptProps {
  bet: Bet;
}

const BetReceipt = ({ bet }: BetReceiptProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-2">
          <Receipt className="w-6 h-6" />
          <h2 className="text-xl font-bold">Comprovante de Aposta</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          #{bet.bet_number}
        </span>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Data/Hora</p>
            <p className="font-medium">{format(new Date(bet.created_at), "dd/MM/yyyy HH:mm:ss")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Período</p>
            <p className="font-medium">{getDrawPeriodName(bet.draw_period)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tipo de Aposta</p>
            <p className="font-medium">{getBetTypeName(bet.bet_type)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Posição</p>
            <p className="font-medium">{bet.position}º</p>
          </div>
          <div>
            <p className="text-muted-foreground">Números</p>
            <p className="font-medium">{bet.numbers.join(", ")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="font-medium">R$ {Number(bet.amount).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Prêmio Potencial:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {bet.prize_amount ? Number(bet.prize_amount).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetReceipt;