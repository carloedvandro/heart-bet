import { CardTitle } from "@/components/ui/card";
import { TradeActions } from "./TradeActions";
import { FinancialProfile } from "@/types/financial";

interface TradeCardHeaderProps {
  financialProfile: FinancialProfile | null;
  onStartInvestment: () => void;
  onWithdraw: () => void;
  onShowRules: () => void;
}

export function TradeCardHeader({ 
  onStartInvestment,
  onWithdraw,
  onShowRules
}: TradeCardHeaderProps) {
  return (
    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <span>Investimento Trade</span>
      <TradeActions 
        onStartInvestment={onStartInvestment}
        onWithdraw={onWithdraw}
        onShowRules={onShowRules}
      />
    </CardTitle>
  );
}