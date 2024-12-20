import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { TradeCard } from "../trade/TradeCard";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { RechargeDialog } from "./RechargeDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface DashboardContentProps {
  profile: Profile | null;
  refreshTrigger: number;
  onBetPlaced: () => void;
}

export const DashboardContent = ({ 
  profile, 
  refreshTrigger, 
  onBetPlaced 
}: DashboardContentProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);

  // Função para abrir o diálogo de confirmação
  const handleRechargeClick = () => {
    setShowConfirmation(true);
  };

  // Função para fechar o diálogo de confirmação e abrir o de recarga
  const handleConfirmation = () => {
    setShowConfirmation(false);
    setTimeout(() => {
      setShowRechargeDialog(true);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <div className="flex justify-end">
        <Button
          onClick={handleRechargeClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Fazer Recarga
        </Button>
      </div>

      <Card className="opacity-85 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/90 transition-all duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Aposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HeartGrid onBetPlaced={onBetPlaced} />
        </CardContent>
      </Card>

      <TradeCard />

      <Card className="opacity-85 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/90 transition-all duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Suas Apostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BetsTable refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>

      <AlertDialog 
        open={showConfirmation} 
        onOpenChange={setShowConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Realizar Recarga</AlertDialogTitle>
            <AlertDialogDescription>
              Você será redirecionado para a tela de recarga onde poderá enviar seu comprovante PIX.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-2">
            <AlertDialogAction onClick={handleConfirmation}>
              Entendi
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <RechargeDialog 
        open={showRechargeDialog}
        onOpenChange={setShowRechargeDialog}
        onRechargeCreated={() => setShowRechargeDialog(false)}
      />
    </div>
  );
};