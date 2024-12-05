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
  const onChangedRef = useRef(onChanged);

  // Update the callback ref when onChanged changes
  useEffect(() => {
    onChangedRef.current = onChanged;
  }, [onChanged]);

  useEffect(() => {
    if (!enabled || !channelName) return;

    let isSubscribed = true;

    const setupSubscription = async () => {
      try {
        // Clean up existing subscription if any
        if (channelRef.current) {
          await channelRef.current.unsubscribe();
          channelRef.current = null;
        }

        // Create new channel
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
              if (isSubscribed && onChangedRef.current) {
                onChangedRef.current();
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Successfully subscribed to ${channelName}`);
            }
          });

      } catch (error) {
        console.error(`Error in subscription for ${channelName}:`, error);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [channelName, schema, table, filter, enabled]); // Remove onChanged from deps
}