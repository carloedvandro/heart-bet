import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAccessButtonProps {
  setProfile: (profile: any) => void;
}

export function AdminAccessButton({ setProfile }: AdminAccessButtonProps) {
  const navigate = useNavigate();

  const handleAdminAccess = async () => {
    try {
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erro ao acessar área administrativa");
        return;
      }

      setProfile(null);
      navigate("/admin-login");
      toast.success("Por favor, faça login como administrador");
    } catch (error) {
      console.error("Error accessing admin area:", error);
      toast.error("Erro ao acessar área administrativa");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleAdminAccess}
      className="w-full"
    >
      Acessar Área Administrativa
    </Button>
  );
}