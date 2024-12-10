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
          console.log("No session found, setting isAdmin to false");
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log("Checking admin status for user:", session.user.id);
        console.log("Current retry count:", retryCount);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching admin status:', error);
          console.log('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details
          });
          
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
            setRetryCount(prev => prev + 1);
            return;
          }
          
          toast.error('Erro ao verificar status de administrador');
          setIsAdmin(false);
        } else {
          console.log("Admin status response:", profile);
          setIsAdmin(!!profile?.is_admin);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
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