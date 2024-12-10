import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Header } from "@/components/dashboard/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Profile } from "@/integrations/supabase/custom-types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const session = useSession();
  const navigate = useNavigate();

  useAuthRedirect();

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No session found in Dashboard, redirecting to login");
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Erro ao carregar perfil");
          return;
        }
        
        setProfile(data);
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        toast.error("Erro ao carregar perfil");
      }
    };

    fetchProfile();
  }, [session, navigate]);

  const handleBetPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header 
          profile={profile} 
          onLogout={handleLogout}
          setProfile={setProfile}
        />
        <DashboardContent 
          profile={profile}
          refreshTrigger={refreshTrigger}
          onBetPlaced={handleBetPlaced}
          setProfile={setProfile}
        />
      </div>
    </div>
  );
}