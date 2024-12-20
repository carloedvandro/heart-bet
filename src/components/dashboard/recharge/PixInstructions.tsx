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
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pague com Pix
          </h3>
          <p className="text-sm text-muted-foreground">
            de qualquer banco
          </p>
        </div>

        <div className="relative p-6 bg-white rounded-xl shadow-md w-full max-w-[300px] mx-auto">
          <img 
            src="/lovable-uploads/ef4a14bc-c808-4168-8d79-ba01d0fa9b6c.png" 
            alt="QR Code PIX"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl pointer-events-none" />
        </div>

        <div className="w-full space-y-3">
          <Label className="text-base font-medium">Chave PIX (CNPJ)</Label>
          <div className="flex gap-2">
            <Input
              value={pixKey}
              readOnly
              className="font-mono text-base bg-white/50 border-purple-200"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyPixKey}
              className="hover:bg-purple-50"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
        <h4 className="font-medium mb-3 text-purple-900">Instruções:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
          <li>Abra o aplicativo do seu banco e acesse a área Pix.</li>
          <li>Procure o leitor de QR code e escaneie o código acima.</li>
          <li>Digite o valor desejado e finalize o pagamento.</li>
          <li>Após o pagamento, envie o comprovante usando o formulário abaixo.</li>
        </ol>
      </div>
    </div>
  );
}