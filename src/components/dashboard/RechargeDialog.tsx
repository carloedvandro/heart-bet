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

export function RechargeDialog() {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRecharge = async () => {
    if (amount <= 0) {
      toast.error("O valor da recarga deve ser maior que zero");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("recharges")
        .insert({
          amount: amount,
        });

      if (error) throw error;

      toast.success("Recarga solicitada com sucesso!");
      setIsOpen(false);
      setAmount(0);
    } catch (error) {
      console.error("Error creating recharge:", error);
      toast.error("Erro ao solicitar recarga. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/90 hover:bg-white">
          <Wallet className="mr-2 h-4 w-4" />
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