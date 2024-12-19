import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { BinancePaymentDialog } from "../payments/BinancePaymentDialog";
import { Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRechargeCreated?: () => void;
}

export function RechargeDialog({ 
  open, 
  onOpenChange,
  onRechargeCreated 
}: RechargeDialogProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [showBinanceDialog, setShowBinanceDialog] = useState(false);
  const PIX_KEY = "30.266.458/0001-58";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !amount) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);

      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      toast.success("Recarga criada com sucesso!");
      onOpenChange(false);
      onRechargeCreated?.();
      setAmount('');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao criar recarga");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      toast.success("Chave PIX copiada!");
    } catch (error) {
      console.error('Error copying PIX key:', error);
      toast.error("Erro ao copiar chave PIX");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Recarga</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setShowBinanceDialog(true)}
                >
                  Pagar com Binance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onOpenChange(false);
                    // Implementar outros métodos de pagamento aqui
                  }}
                >
                  Outros Métodos
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou pague via PIX
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src="/lovable-uploads/ef4a14bc-c808-4168-8d79-ba01d0fa9b6c.png" 
                    alt="QR Code PIX"
                    className="w-64 h-auto"
                  />
                  <div className="w-full space-y-2">
                    <Label>Chave PIX (CNPJ)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={PIX_KEY}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopyPixKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Valor da Recarga</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processando..." : "Confirmar Recarga"}
                  </Button>
                </form>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Instruções:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Abra o aplicativo do seu banco e acesse a área Pix.</li>
                    <li>Procure o leitor de QR code e escaneie o código acima.</li>
                    <li>Digite o valor desejado e finalize o pagamento.</li>
                  </ol>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <BinancePaymentDialog
        open={showBinanceDialog}
        onOpenChange={setShowBinanceDialog}
        onPaymentCreated={onRechargeCreated}
      />
    </>
  );
}