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
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only attempt to sign out if we have a session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error);
          toast.error("Erro ao desconectar");
          return;
        }
      }

      // Clean up and redirect regardless of session state
      if (onLogout) {
        onLogout();
      }
      localStorage.clear();
      navigate("/login");
      toast.success("Desconectado com sucesso");
      
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Erro inesperado ao desconectar");
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