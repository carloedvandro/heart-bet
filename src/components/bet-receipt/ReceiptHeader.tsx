import { Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ReceiptHeader = ({ betNumber }: { betNumber: string }) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="text-center py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-lg">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white tracking-wider`}>
          Corações Premiados
        </h1>
      </div>
      
      <div className="text-center border-b border-dashed border-gray-200 py-3 space-y-1">
        <Receipt className="w-5 h-5 mx-auto mb-1" />
        <p className="text-sm text-gray-600">Comprovante de Aposta</p>
        <p className="text-lg font-bold">#{betNumber}</p>
      </div>
    </>
  );
};

export default ReceiptHeader;