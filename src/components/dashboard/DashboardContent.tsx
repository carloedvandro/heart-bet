import { Profile } from "@/integrations/supabase/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeartGrid from "@/components/HeartGrid";
import { BetsTable } from "./BetsTable";
import { TradeCard } from "../trade/TradeCard";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { RechargeDialog } from "./RechargeDialog";
import { useState } from "react";

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
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
            <AlertDialogAction onClick={() => {
              setShowConfirmation(false);
              setShowRechargeDialog(true);
            }}>
              Entendi
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <RechargeDialog 
        open={showRechargeDialog}
        onOpenChange={setShowRechargeDialog}
        onRechargeCreated={() => {
          setShowRechargeDialog(false);
        }}
      />
    </div>
  );
};