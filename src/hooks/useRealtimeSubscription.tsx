import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription({
  table,
  schema = 'public',
  filter,
  onChanged,
  enabled = true
}: {
  table: string;
  schema?: string;
  filter?: string;
  onChanged: (payload?: any) => void;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    console.log(`Setting up subscription for ${table} with filter:`, filter);
    
    const channel = supabase
      .channel('db_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema,
          table,
          filter,
        },
        (payload) => {
          console.log(`Change detected in ${table}:`, payload);
          onChanged(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Channel status for ${table}:`, status);
      });

    return () => {
      console.log(`Cleaning up subscription for ${table}`);
      supabase.removeChannel(channel);
    };
  }, [table, schema, filter, onChanged, enabled]);
}