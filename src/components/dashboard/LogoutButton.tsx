import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span className="font-medium">Sair</span>
    </button>
  );
}