import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription({
  channel: channelName,
  schema = 'public',
  table,
  filter,
  onChanged,
  enabled = true
}: {
  channel: string;
  schema?: string;
  table: string;
  filter?: string;
  onChanged: () => void;
  enabled?: boolean;
}) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled || !channelName) return;

    // Clean up existing subscription
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    try {
      console.log(`Setting up subscription for ${table}`);
      const channel = supabase.channel(channelName);
      channelRef.current = channel;

      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema,
            table,
            filter,
          },
          () => {
            console.log(`Change detected in ${table}`);
            onChanged();
          }
        )
        .subscribe((status) => {
          console.log(`Channel ${channelName} status:`, status);
        });

      return () => {
        console.log(`Cleaning up subscription for ${table}`);
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error in realtime subscription:', error);
    }
  }, [channelName, schema, table, filter, enabled]);
}