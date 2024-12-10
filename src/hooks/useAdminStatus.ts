import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminStatus = () => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log("Nenhuma sessão encontrada, definindo isAdmin como false");
          setIsAdmin(false);
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
          setIsAdmin(false);
        } else {
          console.log("Resposta do status de admin:", profile);
          setIsAdmin(profile?.is_admin === true);
          setRetryCount(0); // Resetar contador de tentativas em caso de sucesso
        }
      } catch (error) {
        console.error('Erro em checkAdminStatus:', error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Tentando novamente... Tentativa ${retryCount + 1} de ${MAX_RETRIES}`);
          setRetryCount(prev => prev + 1);
          return;
        }
        
        toast.error('Erro ao verificar status de administrador');
        setIsAdmin(false);
      } finally {
        if (retryCount >= MAX_RETRIES) {
          setIsLoading(false);
        }
      }
    };

    const retryTimeout = setTimeout(checkAdminStatus, retryCount * 1000);
    
    return () => clearTimeout(retryTimeout);
  }, [session?.user?.id, retryCount]);

  return { isAdmin, isLoading };
};