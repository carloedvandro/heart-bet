import { PaymentMethodButtons } from "./PaymentMethodButtons";
import { ProofUploader } from "./ProofUploader";
import { PaymentProofsList } from "./PaymentProofsList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AsaasPaymentDialog } from "@/components/payments/AsaasPaymentDialog";
import { useState } from "react";

interface RechargeContentProps {
  pixKey: string;
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
  onProofUploaded: () => void;
}

export function RechargeContent({
  onBinanceClick,
  onOtherMethodsClick,
  onProofUploaded,
}: RechargeContentProps) {
  const [showAsaasDialog, setShowAsaasDialog] = useState(false);

  return (
    <div className="space-y-8 pr-4">
      <PaymentMethodButtons
        onBinanceClick={onBinanceClick}
        onAsaasClick={() => setShowAsaasDialog(true)}
        onOtherMethodsClick={onOtherMethodsClick}
      />

      <ProofUploader onProofUploaded={onProofUploaded} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-200 dark:border-purple-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 text-purple-600 dark:text-purple-300 font-medium">
            Pagamento via PIX
          </span>
        </div>
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-center font-medium">
          Nosso sistema de pagamentos está temporariamente em manutenção. Por favor, não realize nenhum pagamento via PIX ou qualquer outro método neste momento. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-200 dark:border-purple-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 text-purple-600 dark:text-purple-300 font-medium">
            Seus comprovantes
          </span>
        </div>
      </div>

      <PaymentProofsList />

      <AsaasPaymentDialog
        open={showAsaasDialog}
        onOpenChange={setShowAsaasDialog}
        onPaymentCreated={onProofUploaded}
      />
    </div>
  );
}