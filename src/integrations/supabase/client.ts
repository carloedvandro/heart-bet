import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDAzMjUsImV4cCI6MjA0ODk3NjMyNX0.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      attempt++;
      console.error(`Fetch attempt ${attempt} failed:`, error);
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      // Wait with exponential backoff before retrying
      await new Promise(resolve => 
        setTimeout(resolve, Math.min(attempt * 1000, 3000))
      );
    }
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  },
  global: {
    fetch: customFetch
  }
});

// Only log auth state changes, remove any additional processing
supabase.auth.onAuthStateChange((event) => {
  console.log('Auth state changed:', event);
});