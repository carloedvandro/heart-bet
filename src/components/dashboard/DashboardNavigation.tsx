import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  LineChart, 
  TrendingUp, 
  ListOrdered, 
  User 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardNavigation() {
  const navigate = useNavigate();

  const { data: financialProfile } = useQuery({
    queryKey: ['financial-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const isProfileComplete = financialProfile && Object.values(financialProfile).every(value => value !== null);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t p-4 flex justify-center gap-2 flex-wrap z-50">
      <div className="w-full max-w-screen-xl mx-auto flex flex-wrap justify-center gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] max-w-[200px] gap-2 text-xs sm:text-sm" 
          onClick={() => navigate('/dashboard/bet')}
        >
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Aposta</span>
          <span className="sm:hidden">Apostar</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] max-w-[200px] gap-2 text-xs sm:text-sm" 
          onClick={() => navigate('/dashboard/investment')}
        >
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Investimento</span>
          <span className="sm:hidden">Investir</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] max-w-[200px] gap-2 text-xs sm:text-sm" 
          onClick={() => navigate('/dashboard/trade')}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Trade</span>
          <span className="sm:hidden">Trade</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] max-w-[200px] gap-2 text-xs sm:text-sm" 
          onClick={() => navigate('/dashboard/bets')}
        >
          <ListOrdered className="h-4 w-4" />
          <span className="hidden sm:inline">Suas Apostas</span>
          <span className="sm:hidden">Apostas</span>
        </Button>
        
        <Button 
          variant={isProfileComplete ? "outline" : "default"}
          className="flex-1 min-w-[120px] max-w-[200px] gap-2 text-xs sm:text-sm" 
          onClick={() => navigate('/dashboard/profile')}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{isProfileComplete ? "Meu Perfil" : "Completar Cadastro"}</span>
          <span className="sm:hidden">{isProfileComplete ? "Perfil" : "Cadastro"}</span>
        </Button>
      </div>
    </div>
  );
}