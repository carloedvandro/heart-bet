import html2canvas from "html2canvas";
import { toast } from "sonner";

export const captureReceipt = async (receiptRef: React.RefObject<HTMLDivElement>) => {
  if (!receiptRef.current) {
    console.error("Receipt ref is null");
    throw new Error("Erro ao gerar imagem do comprovante");
  }

  const receipt = receiptRef.current;
  receipt.style.opacity = '1';
  receipt.style.visibility = 'visible';

  console.log("Receipt dimensions:", {
    width: receipt.offsetWidth,
    height: receipt.offsetHeight
  });

  // Wait for animations and rendering to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  const canvas = await html2canvas(receipt, {
    scale: 3, // Increased from 2 to 3 for better quality
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: true,
    windowWidth: receipt.offsetWidth * 2, // Ensure proper scaling
    windowHeight: receipt.offsetHeight * 2,
    onclone: (_, element) => {
      console.log("Cloning document for canvas");
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.position = 'relative';
      element.style.transform = 'none';
      element.style.backgroundColor = '#ffffff';
      // Force a repaint to ensure all elements are rendered
      element.style.transform = 'translateZ(0)';
    }
  });

  return canvas;
};

export const shareReceipt = async (
  blob: Blob,
  betNumber: string,
  fallbackToDownload = true
) => {
  // Compress the image less to maintain quality
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