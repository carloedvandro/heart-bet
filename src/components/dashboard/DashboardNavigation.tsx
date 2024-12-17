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
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t p-4 flex justify-center gap-2 flex-wrap">
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => navigate('/dashboard/bet')}
      >
        <Heart className="h-4 w-4" />
        Nova Aposta
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => navigate('/dashboard/investment')}
      >
        <LineChart className="h-4 w-4" />
        Investimento
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => navigate('/dashboard/trade')}
      >
        <TrendingUp className="h-4 w-4" />
        Trade
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={() => navigate('/dashboard/bets')}
      >
        <ListOrdered className="h-4 w-4" />
        Suas Apostas
      </Button>
      
      <Button 
        variant={isProfileComplete ? "outline" : "default"}
        className="gap-2" 
        onClick={() => navigate('/dashboard/profile')}
      >
        <User className="h-4 w-4" />
        {isProfileComplete ? "Meu Perfil" : "Completar Cadastro"}
      </Button>
    </div>
  );
}