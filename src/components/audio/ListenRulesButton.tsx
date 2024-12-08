import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import FloatingAudioPlayer from "./FloatingAudioPlayer";

interface ListenRulesButtonProps {
  audioUrl: string;
}

const ListenRulesButton = ({ audioUrl }: ListenRulesButtonProps) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsPlayerOpen(true)}
        className="gap-2"
      >
        <Volume2 className="h-4 w-4" />
        Ouvir Regras
      </Button>

      <FloatingAudioPlayer
        audioUrl={audioUrl}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
};

export default ListenRulesButton;