import html2canvas from "html2canvas";
import { toast } from "sonner";

export const captureReceipt = async (receiptRef: React.RefObject<HTMLDivElement>) => {
  if (!receiptRef.current) {
    console.error("Receipt ref is null");
    throw new Error("Erro ao gerar imagem do comprovante");
  }

  const receipt = receiptRef.current;
  
  // Forçar renderização com estilo específico para captura
  const originalStyle = receipt.style.cssText;
  receipt.style.cssText = `
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    background-color: white !important;
    width: 100% !important;
    padding: 20px !important;
    font-family: 'Times New Roman', Times, serif !important;
    letter-spacing: 0.025em !important;
    line-height: 1.5 !important;
  `;

  // Aguardar renderização
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(receipt, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: receipt.offsetWidth,
      height: receipt.offsetHeight,
      onclone: (doc, element) => {
        const clonedElement = element as HTMLElement;
        clonedElement.style.cssText = `
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          background-color: white !important;
          width: 100% !important;
          padding: 20px !important;
          font-family: 'Times New Roman', Times, serif !important;
          letter-spacing: 0.025em !important;
          line-height: 1.5 !important;
        `;
      }
    });

    // Restaurar estilo original
    receipt.style.cssText = originalStyle;
    return canvas;
  } catch (error) {
    console.error("Error capturing receipt:", error);
    receipt.style.cssText = originalStyle;
    throw error;
  }
};

export const shareReceipt = async (
  blob: Blob,
  betNumber: string,
  fallbackToDownload = true
) => {
  const file = new File([blob], `comprovante-${betNumber}.png`, { 
    type: 'image/png'
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Comprovante de Aposta',
        text: 'Confira meu comprovante de aposta!'
      });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError" && fallbackToDownload) {
        downloadBlob(blob, betNumber);
        toast.info("Não foi possível compartilhar. O arquivo foi baixado.");
      }
      return false;
    }
  } else if (fallbackToDownload) {
    downloadBlob(blob, betNumber);
    toast.info("Seu dispositivo não suporta compartilhamento direto. A imagem foi baixada.");
    return false;
  }
  return false;
};

const downloadBlob = (blob: Blob, betNumber: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprovante-${betNumber}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};