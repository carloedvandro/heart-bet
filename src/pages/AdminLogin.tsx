import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AdminAuthForm } from "@/components/admin/auth/AdminAuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          // Verificar se o usuário é admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error checking admin status:", profileError);
            toast.error("Erro ao verificar permissões");
            return;
          }

          if (profile?.is_admin) {
            navigate("/admin/dashboard");
          } else {
            toast.error("Acesso não autorizado");
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Erro inesperado ao verificar sessão");
      }
    };

    checkAdminSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Área Administrativa
          </h1>
          <p className="text-gray-600 mt-2">
            Acesso restrito
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <AdminAuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}