import { useEffect, useRef, useCallback } from 'react';
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
  const onChangedRef = useRef(onChanged);

  // Update the callback ref when onChanged changes
  useEffect(() => {
    onChangedRef.current = onChanged;
  }, [onChanged]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log('Cleaning up channel subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !channelName) return;

    cleanup();

    const uniqueChannelName = `${channelName}_${Date.now()}`;
    console.log(`Setting up new subscription for ${uniqueChannelName}`);

    const channel = supabase.channel(uniqueChannelName);
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
        (payload) => {
          console.log(`Received change for ${table}:`, payload);
          onChangedRef.current();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${uniqueChannelName}:`, status);
      });

    return cleanup;
  }, [channelName, schema, table, filter, enabled, cleanup]);
}