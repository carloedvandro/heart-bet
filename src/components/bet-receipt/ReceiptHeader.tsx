import { Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ReceiptHeader = ({ betNumber }: { betNumber: string }) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="text-center py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-lg">
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white font-sans tracking-wider animate-pulse`}>
          Corações Premiados
        </h1>
      </div>
      
      <div className="text-center border-b border-dashed border-gray-200 py-2">
        <Receipt className="w-5 h-5 mx-auto mb-1" />
        <p className="text-xs text-gray-500">Comprovante de Aposta</p>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} font-bold`}>#{betNumber}</p>
      </div>
    </>
  );
};

export default ReceiptHeader;