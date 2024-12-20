import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Card className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
            <CardContent className="p-0">
              <img 
                src="/lovable-uploads/ef4a14bc-c808-4168-8d79-ba01d0fa9b6c.png" 
                alt="QR Code PIX"
                className="w-80 h-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full space-y-2">
          <Label className="text-purple-700 dark:text-purple-300">Chave PIX (CNPJ)</Label>
          <div className="flex gap-2">
            <Input
              value={pixKey}
              readOnly
              className="font-mono text-sm bg-purple-50 border-purple-200 dark:bg-gray-800 dark:border-purple-700"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyPixKey}
              className="bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300 dark:bg-gray-800 dark:border-purple-700 dark:hover:bg-purple-900/50"
            >
              <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">Instruções</h3>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Abra o aplicativo do seu banco e acesse a área Pix</li>
            <li>Procure o leitor de QR code e escaneie o código acima</li>
            <li>Digite o valor desejado e finalize o pagamento</li>
            <li>Após o pagamento, envie o comprovante usando o formulário abaixo</li>
            <li>Aguarde a confirmação do seu pagamento</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}