import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
import { PixInstructions } from "@/components/dashboard/recharge/PixInstructions";
import { ProofUploader } from "@/components/dashboard/recharge/ProofUploader";
import { PaymentProofsList } from "@/components/dashboard/recharge/PaymentProofsList";
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function Recharge() {
  const navigate = useNavigate();
  const PIX_KEY = "30.266.458/0001-58";
  const [showInstructions, setShowInstructions] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  // Mostrar instruções ao carregar a página
  useEffect(() => {
    setShowInstructions(true);
  }, []);

  const handleProofUploaded = () => {
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    toast.success("Comprovante enviado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-purple-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Recarga
          </h1>
          <div className="w-24" /> {/* Espaçador para centralizar o título */}
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-lg shadow-xl border border-purple-100">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6 space-y-8">
              <PixInstructions pixKey={PIX_KEY} />
              <ProofUploader onProofUploaded={handleProofUploaded} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-purple-600 font-medium">
                    Seus comprovantes
                  </span>
                </div>
              </div>

              <PaymentProofsList />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Diálogo de instruções inicial */}
      <AlertDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Instruções para Recarga</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Para realizar sua recarga, siga os passos abaixo:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Faça um PIX para a chave fornecida</li>
                <li>Tire um print ou foto do comprovante</li>
                <li>Envie o comprovante através do formulário</li>
                <li>Aguarde a confirmação do pagamento</li>
              </ol>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-2">
            <AlertDialogAction onClick={() => setShowInstructions(false)}>
              Entendi
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação do envio */}
      <AlertDialog 
        open={showAlert} 
        onOpenChange={setShowAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Comprovante Enviado!</AlertDialogTitle>
            <AlertDialogDescription>
              Seu comprovante foi enviado com sucesso e será analisado em breve.
              O valor será creditado em sua conta assim que confirmado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-2">
            <AlertDialogAction onClick={handleAlertClose}>
              Entendi
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}