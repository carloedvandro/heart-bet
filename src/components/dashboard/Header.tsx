import { Profile } from "@/integrations/supabase/custom-types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { BalanceDisplay } from "./BalanceDisplay";
import { RechargeDialog } from "./RechargeDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  profile: Profile | null;
  onLogout?: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First try to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
    } finally {
      // Always perform these cleanup actions
      if (onLogout) {
        onLogout();
      }
      
      // Clear any local storage items related to auth
      localStorage.clear();
      
      // Navigate to login and show success message
      navigate("/login");
      toast.success("Desconectado com sucesso");
    }
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-white">Corações Premiados</h1>
        <BalanceDisplay profile={profile} />
      </div>
      <div className="flex items-center gap-4">
        <RechargeDialog />
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="bg-white/90 hover:bg-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}