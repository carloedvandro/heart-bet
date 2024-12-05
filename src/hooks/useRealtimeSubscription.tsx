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
    let isMounted = true;

    const setupSubscription = async () => {
      if (!enabled || !channelName) return;

      try {
        // Cleanup any existing subscription
        if (channelRef.current) {
          console.log(`Cleaning up existing subscription for ${channelName}`);
          await channelRef.current.unsubscribe();
          channelRef.current = null;
        }

        // Create a new channel
        console.log(`Setting up new subscription for ${channelName}`);
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
              if (isMounted) {
                console.log(`Received change event on ${channelName}`);
                onChanged();
              }
            }
          )
          .subscribe((status) => {
            console.log(`Subscription status for ${channelName}:`, status);
          });
      } catch (error) {
        console.error(`Error setting up subscription for ${channelName}:`, error);
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        console.log(`Cleaning up subscription for ${channelName}`);
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [channelName, schema, table, filter, onChanged, enabled]);
}