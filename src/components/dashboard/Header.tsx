import { Profile } from "@/integrations/supabase/custom-types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { BalanceDisplay } from "./BalanceDisplay";

interface HeaderProps {
  profile: Profile | null;
  onLogout: () => void;
}

export function Header({ profile, onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-white">Corações Premiados</h1>
        <BalanceDisplay profile={profile} />
      </div>
      <Button variant="outline" onClick={onLogout} className="bg-white/90 hover:bg-white">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}