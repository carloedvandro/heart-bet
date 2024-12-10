import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        toast.error("Acesso não autorizado");
        navigate("/admin/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
          <div className="space-y-4">
            {/* Aqui você pode adicionar o conteúdo do painel administrativo */}
            <p className="text-gray-600">
              Bem-vindo ao painel administrativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}