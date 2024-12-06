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

  // Longer wait time for iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const waitTime = isIOS ? 2000 : 1000;
  
  // Wait for animations and rendering to complete
  await new Promise(resolve => setTimeout(resolve, waitTime));

  const canvas = await html2canvas(receipt, {
    scale: 4, // Increased scale for better quality on mobile
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: true,
    windowWidth: receipt.offsetWidth * 2,
    windowHeight: receipt.offsetHeight * 2,
    onclone: (doc, element) => {
      console.log("Cloning document for canvas");
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.position = 'relative';
      element.style.transform = 'none';
      element.style.backgroundColor = '#ffffff';
      
      // Force better rendering on iOS
      if (isIOS) {
        element.style.webkitTransform = 'translateZ(0)';
        element.style.webkitPerspective = '1000';
        element.style.backfaceVisibility = 'hidden';
      }
      
      // Force a repaint
      element.style.transform = 'translateZ(0)';
      
      // Ensure all images are loaded
      const images = element.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].style.maxWidth = '100%';
        images[i].style.height = 'auto';
      }
    }
  });

  return canvas;
};

export const shareReceipt = async (
  blob: Blob,
  betNumber: string,
  fallbackToDownload = true
) => {
  // Create high quality PNG
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