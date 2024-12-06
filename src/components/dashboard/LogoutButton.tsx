import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
    } finally {
      if (onLogout) {
        onLogout();
      }
      localStorage.clear();
      navigate("/login");
      toast.success("Desconectado com sucesso");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout} 
      className="bg-white/90 hover:bg-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}