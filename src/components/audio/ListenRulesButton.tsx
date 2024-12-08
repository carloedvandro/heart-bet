import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import FloatingAudioPlayer from "./FloatingAudioPlayer";

interface ListenRulesButtonProps {
  audioUrl: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ListenRulesButton = ({ audioUrl, isOpen, onOpenChange }: ListenRulesButtonProps) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => onOpenChange(true)}
        className="gap-2"
      >
        <Volume2 className="h-4 w-4" />
        Ouvir Regras
      </Button>

      <FloatingAudioPlayer
        audioUrl={audioUrl}
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
      />
    </>
  );
};

export default ListenRulesButton;