import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentMethodButtons } from "./PaymentMethodButtons";
import { PixInstructions } from "./PixInstructions";
import { ProofUploader } from "./ProofUploader";
import { PaymentProofsList } from "./PaymentProofsList";

interface RechargeContentProps {
  pixKey: string;
  onBinanceClick: () => void;
  onOtherMethodsClick: () => void;
  onProofUploaded: () => void;
}

export function RechargeContent({
  pixKey,
  onBinanceClick,
  onOtherMethodsClick,
  onProofUploaded,
}: RechargeContentProps) {
  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="space-y-8 pr-4">
        <PaymentMethodButtons
          onBinanceClick={onBinanceClick}
          onOtherMethodsClick={onOtherMethodsClick}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-purple-200 dark:border-purple-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 text-purple-600 dark:text-purple-300 font-medium">
              Ou pague via PIX
            </span>
          </div>
        </div>

        <PixInstructions pixKey={pixKey} />
        
        <ProofUploader onProofUploaded={onProofUploaded} />

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
      </div>
    </ScrollArea>
  );
}