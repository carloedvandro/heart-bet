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
  const waitTime = isIOS ? 3000 : 1000; // Increased to 3 seconds for iOS

  // Pre-optimize for iOS
  if (isIOS) {
    receipt.style.webkitTransform = 'translateZ(0)';
    receipt.style.webkitPerspective = '1000';
    receipt.style.backfaceVisibility = 'hidden';
  }
  
  // Wait for animations and rendering to complete
  await new Promise(resolve => setTimeout(resolve, waitTime));

  const canvas = await html2canvas(receipt, {
    scale: 4,
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: true,
    windowWidth: receipt.offsetWidth * 2,
    windowHeight: receipt.offsetHeight * 2,
    onclone: (doc, element) => {
      console.log("Cloning document for canvas");
      
      const htmlElement = element as HTMLElement; // Type assertion to HTMLElement
      
      // Force immediate rendering
      htmlElement.style.willChange = 'transform';
      htmlElement.style.opacity = '1';
      htmlElement.style.visibility = 'visible';
      htmlElement.style.position = 'relative';
      htmlElement.style.transform = 'none';
      htmlElement.style.backgroundColor = '#ffffff';
      
      // Enhanced iOS optimizations
      if (isIOS) {
        htmlElement.style.webkitTransform = 'translateZ(0)';
        htmlElement.style.webkitPerspective = '1000';
        htmlElement.style.backfaceVisibility = 'hidden';
        htmlElement.style.webkitBackfaceVisibility = 'hidden';
        // Using type assertion for webkit prefix
        (htmlElement.style as any).webkitOverflowScrolling = 'touch';
        
        // Force GPU acceleration
        htmlElement.style.transform = 'translate3d(0,0,0)';
      }
      
      // Ensure all images and fonts are loaded
      const images = element.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        const img = images[i] as HTMLImageElement;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        // Force image loading
        if (img.complete) {
          console.log(`Image ${i} already loaded`);
        } else {
          console.log(`Waiting for image ${i} to load`);
        }
      }

      // Force text rendering
      const textElements = element.getElementsByTagName('*');
      for (let i = 0; i < textElements.length; i++) {
        const el = textElements[i] as HTMLElement;
        if (el.textContent) {
          el.style.textRendering = 'optimizeLegibility';
        }
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