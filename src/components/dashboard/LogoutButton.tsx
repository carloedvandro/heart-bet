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
      className={`bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600 hover:text-rose-700 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 dark:hover:text-rose-300 ${
        isMobile ? 'text-xs h-8 px-2' : ''
      }`}
    >
      <LogOut className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
      {isMobile ? 'Sair' : 'Sair da Conta'}
    </Button>
  );
}