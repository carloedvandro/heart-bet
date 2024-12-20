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
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-purple-100">
          <img 
            src="/lovable-uploads/ef4a14bc-c808-4168-8d79-ba01d0fa9b6c.png" 
            alt="QR Code PIX"
            className="w-full h-auto max-w-[400px] mx-auto rounded-lg"
          />
        </div>
        
        <div className="w-full space-y-2 max-w-md">
          <Label className="text-sm font-medium text-purple-700">Chave PIX (CNPJ)</Label>
          <div className="flex gap-2">
            <Input
              value={pixKey}
              readOnly
              className="font-mono text-sm bg-white/50 border-purple-200"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyPixKey}
              className="px-3 hover:bg-purple-500 hover:text-white transition-all duration-300 border-purple-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-100/50 to-pink-100/50 p-6 rounded-xl border border-purple-200/50">
        <h4 className="text-base font-semibold text-purple-700 mb-4">Instruções:</h4>
        <ol className="list-decimal list-inside space-y-3 text-sm text-purple-900">
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