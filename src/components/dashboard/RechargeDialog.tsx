import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { playSounds } from "@/utils/soundEffects";

export function RechargeDialog() {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRecharge = async () => {
    if (amount <= 0) {
      playSounds.error();
      toast.error("O valor da recarga deve ser maior que zero");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        playSounds.error();
        toast.error("Usuário não autenticado");
        return;
      }

      const { error } = await supabase
        .from("recharges")
        .insert({
          amount: amount,
          user_id: user.id
        });

      if (error) throw error;

      playSounds.recharge();
      toast.success("Recarga solicitada com sucesso!");
      setIsOpen(false);
      setAmount(0);
    } catch (error) {
      console.error("Error creating recharge:", error);
      playSounds.error();
      toast.error("Erro ao solicitar recarga. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-700"
        >
          <Wallet className="mr-1 h-4 w-4" />
          Recarregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recarregar Saldo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor da Recarga (R$)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Digite o valor"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleRecharge} disabled={isLoading}>
            {isLoading ? "Processando..." : "Confirmar Recarga"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}