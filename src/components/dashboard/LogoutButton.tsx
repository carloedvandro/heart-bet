import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      variant="outline" 
      onClick={onLogout} 
      className={`hover:bg-destructive/10 border-destructive/20 text-destructive hover:text-destructive/90 dark:hover:bg-destructive/20 ${
        isMobile ? 'text-xs h-8 px-2' : ''
      }`}
    >
      <LogOut className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
      {isMobile ? 'Sair' : 'Sair da Conta'}
    </Button>
  );
}