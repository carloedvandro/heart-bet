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
import { Wallet, Upload } from "lucide-react";
import { playSounds } from "@/utils/soundEffects";

export function RechargeDialog() {
  const [amount, setAmount] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Verificar se é uma imagem
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem como comprovante");
        return;
      }
      // Verificar tamanho (máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("O arquivo deve ter menos de 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRecharge = async () => {
    if (amount <= 0) {
      playSounds.error();
      toast.error("O valor da recarga deve ser maior que zero");
      return;
    }

    if (!file) {
      playSounds.error();
      toast.error("Por favor, anexe o comprovante de pagamento");
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

      // Criar a recarga
      const { data: recharge, error: rechargeError } = await supabase
        .from("recharges")
        .insert({
          amount: amount,
          user_id: user.id
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      // Upload do comprovante
      const fileExt = file.name.split('.').pop();
      const filePath = `${recharge.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Criar registro do comprovante
      const { error: proofError } = await supabase
        .from('payment_proofs')
        .insert({
          recharge_id: recharge.id,
          file_path: filePath,
        });

      if (proofError) throw proofError;

      playSounds.recharge();
      toast.success("Recarga solicitada com sucesso!");
      setIsOpen(false);
      setAmount(0);
      setFile(null);
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
          className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-700"
        >
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
          <div className="grid gap-2">
            <Label htmlFor="proof">Comprovante de Pagamento</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Máximo: 5MB. Apenas imagens.
            </p>
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