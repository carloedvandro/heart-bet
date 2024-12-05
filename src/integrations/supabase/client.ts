import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkxRUmZQWmJsanJKVzZxOEIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL213ZGF4Z3d1enRjY3hmZ2J1c3VqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJyZWYiOiJtd2RheGd3dXp0Y2N4ZmdidXN1aiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMzNDAwMzI1LCJleHAiOjIwNDg5NzYzMjV9.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Disable URL detection to prevent token recursion
  },
  realtime: {
    params: {
      eventsPerSecond: 1 // Rate limit realtime events
    }
  }
});

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});