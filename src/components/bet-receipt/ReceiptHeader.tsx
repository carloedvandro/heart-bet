import { Receipt } from "lucide-react";

const ReceiptHeader = ({ betNumber }: { betNumber: string }) => {
  return (
    <>
      <div className="text-center py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-sans tracking-wider animate-pulse">
          Corações Premiados
        </h1>
      </div>
      
      <div className="text-center border-b border-dashed border-gray-200 pb-3">
        <Receipt className="w-6 h-6 mx-auto mb-1" />
        <p className="text-xs text-gray-500">Comprovante de Aposta</p>
        <p className="text-base font-bold">#{betNumber}</p>
      </div>
    </>
  );
};

export default ReceiptHeader;