import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminStatus = () => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log("No session found, setting isAdmin to false");
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log("Checking admin status for user:", session.user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching admin status:', error);
          toast.error('Erro ao verificar status de administrador');
          setIsAdmin(false);
        } else {
          console.log("Admin status response:", profile);
          setIsAdmin(!!profile?.is_admin);
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error('Erro ao verificar status de administrador');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session?.user?.id]);

  return { isAdmin, isLoading };
};