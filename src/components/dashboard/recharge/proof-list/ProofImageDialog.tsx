import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProofImageDialogProps {
  imageUrl: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ProofImageDialog({ imageUrl, onOpenChange }: ProofImageDialogProps) {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Comprovante"
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: '80vh' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}