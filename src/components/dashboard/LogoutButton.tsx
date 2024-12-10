import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}