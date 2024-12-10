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
      className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}