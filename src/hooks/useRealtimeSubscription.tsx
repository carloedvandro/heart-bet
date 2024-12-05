import { useEffect, useRef } from 'react';
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
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    console.log(`Setting up subscription for ${table} with filter:`, filter);
    
    // Create a unique channel name based on table and filter
    const channelName = `${table}_${filter || 'all'}`;
    
    channelRef.current = supabase
      .channel(channelName)
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
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, schema, filter, onChanged, enabled]);
}