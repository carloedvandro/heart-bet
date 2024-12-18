import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PixGenerator() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    pixQrCode: string;
    pixKey: string;
  } | null>(null);
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para gerar um PIX");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Por favor, insira um valor válido");
      return;
    }

    setLoading(true);
    try {
      // Criar registro de recarga pendente
      const { data: recharge, error: rechargeError } = await supabase
        .from('recharges')
        .insert({
          user_id: session.user.id,
          amount: numericAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (rechargeError) throw rechargeError;

      // Gerar PIX via Asaas
      const { data, error } = await supabase.functions.invoke('generate-asaas-payment', {
        body: { amount: numericAmount }
      });

      if (error) throw error;

      setPixData({
        pixQrCode: data.payment.pixQrCode,
        pixKey: data.payment.pixKey
      });

      toast.success("PIX gerado com sucesso!");
    } catch (error) {
      console.error('Error generating PIX:', error);
      toast.error("Erro ao gerar PIX. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixKey = async () => {
    if (!pixData?.pixKey) return;
    
    try {
      await navigator.clipboard.writeText(pixData.pixKey);
      toast.success("Código PIX copiado!");
    } catch (error) {
      console.error('Error copying PIX key:', error);
      toast.error("Erro ao copiar código PIX");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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
          />
        </div>

        <Button
          type="submit"
          className="w-full"
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

      {pixData && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${pixData.pixQrCode}`}
              alt="QR Code PIX"
              className="w-48 h-48"
            />
          </div>

          <div className="space-y-2">
            <Label>Código PIX</Label>
            <div className="flex gap-2">
              <Input
                value={pixData.pixKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyPixKey}
              >
                Copiar
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Após o pagamento, seu saldo será atualizado automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}