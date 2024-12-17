import { useState } from "react";
import { Bet } from "@/integrations/supabase/custom-types";
import BettingForm from "./betting/BettingForm";
import BetReceipt from "./BetReceipt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTemporaryBetState } from "@/hooks/useTemporaryBetState";
import { BetType } from "@/types/betting";

interface HeartGridProps {
  onBetPlaced?: () => void;
}

const HeartGrid = ({ onBetPlaced }: HeartGridProps) => {
  const [lastBet, setLastBet] = useState<Bet | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBet, setPendingBet] = useState<Bet | null>(null);
  const [currentBetType, setCurrentBetType] = useState<BetType>("simple_group");
  const { clearCombinations } = useTemporaryBetState();

  const handleReset = () => {
    console.log("Resetting bet state");
    setLastBet(null);
    setPendingBet(null);
    setShowConfirmDialog(false);
    clearCombinations();
  };

  const handleBetPlaced = (bet: Bet) => {
    console.log("New bet placed, showing confirmation dialog:", bet);
    setPendingBet(bet);
    setCurrentBetType(bet.bet_type as BetType);
    setShowConfirmDialog(true);
    if (onBetPlaced) {
      onBetPlaced();
    }
  };

  const handleViewReceipt = () => {
    console.log("User chose to view receipt for bet:", pendingBet);
    if (pendingBet) {
      setLastBet(pendingBet);
      setShowConfirmDialog(false);
    }
  };

  const handleSkipReceipt = () => {
    console.log("User chose to skip receipt view");
    handleReset();
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {lastBet ? (
        <BetReceipt bet={lastBet} onReset={handleReset} />
      ) : (
        <BettingForm 
          onBetPlaced={handleBetPlaced} 
          initialBetType={currentBetType}
          key={pendingBet ? undefined : 'new-bet'} 
        />
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Aposta Registrada!</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja visualizar o comprovante da sua aposta?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction 
              onClick={handleViewReceipt}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Sim, ver comprovante
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={handleSkipReceipt}
              className="w-full"
            >
              Não, fazer nova aposta
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeartGrid;