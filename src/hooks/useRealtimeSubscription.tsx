import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription({
  channel: channelName,
  schema = 'public',
  table,
  filter,
  onChanged
}: {
  channel: string;
  schema?: string;
  table: string;
  filter?: string;
  onChanged: () => void;
}) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!channelName) return;

    // Cleanup any existing subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    // Create a new channel
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
          onChanged();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);
      });

    return () => {
      console.log(`Cleaning up subscription for ${channelName}`);
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [channelName, schema, table, filter, onChanged]);
}