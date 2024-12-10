import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAdminStatus = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log("Nenhuma sessão encontrada, redirecionando para login admin");
          navigate('/admin-login');
          setIsLoading(false);
          return;
        }

        console.log("Verificando status de admin para usuário:", session.user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar status de admin:', error);
          
          if (retryCount < MAX_RETRIES) {
            console.log(`Tentando novamente... Tentativa ${retryCount + 1} de ${MAX_RETRIES}`);
            setRetryCount(prev => prev + 1);
            return;
          }
          
          toast.error('Erro ao verificar status de administrador');
          navigate('/admin-login');
          setIsAdmin(false);
        } else {
          console.log("Resposta do status de admin:", profile);
          
          if (!profile?.is_admin) {
            console.log("Usuário não é admin, redirecionando...");
            toast.error("Acesso não autorizado");
            navigate('/dashboard');
            return;
          }
          
          setIsAdmin(true);
          setRetryCount(0);
        }
      } catch (error) {
        console.error('Erro em checkAdminStatus:', error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Tentando novamente... Tentativa ${retryCount + 1} de ${MAX_RETRIES}`);
          setRetryCount(prev => prev + 1);
          return;
        }
        
        toast.error('Erro ao verificar status de administrador');
        navigate('/admin-login');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session?.user?.id, retryCount, navigate]);

  return { isAdmin, isLoading };
};