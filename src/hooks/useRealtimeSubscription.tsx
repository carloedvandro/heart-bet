import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  useEffect(() => {
    const channel = supabase.channel(channelName);

    const subscription = channel
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
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelName, schema, table, filter, onChanged]);
}