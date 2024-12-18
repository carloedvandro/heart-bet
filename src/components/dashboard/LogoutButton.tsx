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
      className={`bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white border-none shadow-md hover:shadow-lg transition-all ${
        isMobile ? 'text-xs h-8 px-2' : ''
      }`}
    >
      <LogOut className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
      {isMobile ? 'Sair' : 'Sair da Conta'}
    </Button>
  );
}