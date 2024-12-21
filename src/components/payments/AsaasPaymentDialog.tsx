import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AsaasPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentCreated?: () => void;
}

export function AsaasPaymentDialog({ 
  open, 
  onOpenChange,
  onPaymentCreated 
}: AsaasPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeText, setQrCodeText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      setLoading(true);
      const numericAmount = Number(amount);
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.error("Por favor, insira um valor válido");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-asaas-payment', {
        body: { amount: numericAmount }
      });

      if (error) throw error;

      if (!data?.payment?.pixQrCode || !data?.payment?.pixKey) {
        throw new Error('Dados do PIX inválidos');
      }

      setQrCode(data.payment.pixQrCode);
      setQrCodeText(data.payment.pixKey);
      toast.success("PIX gerado com sucesso!");
      
    } catch (error) {
      console.error('Error generating payment:', error);
      toast.error("Erro ao gerar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixKey = async () => {
    if (!qrCodeText) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeText);
      toast.success("Código PIX copiado!");
    } catch (error) {
      console.error('Error copying PIX key:', error);
      toast.error("Erro ao copiar código PIX");
    }
  };

  const handleClose = () => {
    setQrCode(null);
    setQrCodeText(null);
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Recarga via PIX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!qrCode ? (
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
                  placeholder="0.00"
                  required
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  "Gerar PIX"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <Label>Código PIX</Label>
                <div className="flex gap-2">
                  <Input
                    value={qrCodeText || ""}
                    readOnly
                    className="font-mono text-sm bg-white/50 dark:bg-gray-800/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyPixKey}
                    className="shrink-0"
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <Alert className="bg-purple-50/50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                <AlertDescription className="text-sm text-center text-purple-800 dark:text-purple-200">
                  Após o pagamento, seu saldo será atualizado automaticamente.
                </AlertDescription>
              </Alert>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setQrCode(null);
                  setQrCodeText(null);
                  setAmount("");
                }}
              >
                Gerar novo PIX
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}