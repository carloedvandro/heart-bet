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
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md mx-auto">
          <img 
            src="/lovable-uploads/ef4a14bc-c808-4168-8d79-ba01d0fa9b6c.png" 
            alt="QR Code PIX"
            className="w-full h-auto max-w-[300px] mx-auto"
          />
        </div>
        
        <div className="w-full space-y-2 max-w-md">
          <Label className="text-sm font-medium">Chave PIX (CNPJ)</Label>
          <div className="flex gap-2">
            <Input
              value={pixKey}
              readOnly
              className="font-mono text-sm bg-muted/50"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyPixKey}
              className="px-3 hover:bg-muted/50"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-3">Instruções:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Abra o aplicativo do seu banco e acesse a área Pix</li>
          <li>Procure o leitor de QR code e escaneie o código acima</li>
          <li>Digite o valor desejado e finalize o pagamento</li>
          <li>Após o pagamento, envie o comprovante usando o formulário abaixo</li>
          <li>Aguarde a confirmação do seu pagamento</li>
        </ol>
      </div>
    </div>
  );
}