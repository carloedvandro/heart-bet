import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PixInstructionsProps {
  pixKey: string;
}

export function PixInstructions({ pixKey }: PixInstructionsProps) {
  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      toast.success("Chave PIX copiada!");
    } catch (error) {
      console.error('Error copying PIX key:', error);
      toast.error("Erro ao copiar chave PIX");
    }
  };

  return (
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
              value={pixKey}
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

      <div className="text-sm text-muted-foreground space-y-2">
        <p>Instruções:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Abra o aplicativo do seu banco e acesse a área Pix.</li>
          <li>Procure o leitor de QR code e escaneie o código acima.</li>
          <li>Digite o valor desejado e finalize o pagamento.</li>
          <li>Após o pagamento, envie o comprovante usando o formulário abaixo.</li>
          <li>Aguarde a confirmação do seu pagamento.</li>
        </ol>
      </div>
    </div>
  );
}