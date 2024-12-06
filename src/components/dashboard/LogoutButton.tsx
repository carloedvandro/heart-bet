import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button 
      variant="outline" 
      onClick={onLogout} 
      className="bg-white/90 hover:bg-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}