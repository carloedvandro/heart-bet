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
      className={`bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700 ${
        isMobile ? 'text-xs h-8 px-2' : ''
      }`}
    >
      <LogOut className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
      {isMobile ? 'Sair' : 'Sair da Conta'}
    </Button>
  );
}