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
      className="flex items-center gap-2 whitespace-nowrap"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}