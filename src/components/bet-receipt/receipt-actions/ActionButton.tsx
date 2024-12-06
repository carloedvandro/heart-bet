import { Button } from "../../ui/button";
import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default";
}

const ActionButton = ({ icon: Icon, label, onClick, variant = "outline" }: ActionButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 ${isMobile ? 'text-xs h-7' : 'text-xs h-8'}`}
    >
      <Icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
      {label}
    </Button>
  );
};

export default ActionButton;