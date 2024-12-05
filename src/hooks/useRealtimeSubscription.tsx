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

    // Clean up existing subscription if any
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel with a unique name to avoid conflicts
    const uniqueChannelName = `${channelName}_${Date.now()}`;
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
        () => {
          if (onChanged) {
            onChanged();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${uniqueChannelName}`);
        }
      });

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelName, schema, table, filter, enabled, onChanged]);
}