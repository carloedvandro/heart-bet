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
      const headers = new Headers(init?.headers || {});
      
      // Only add these headers if they're not already present
      if (!headers.has('apikey')) {
        headers.set('apikey', supabaseKey);
      }
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${supabaseKey}`);
      }
      
      // Set default headers if not present
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
      }

      const response = await fetch(url, {
        ...init,
        headers
      });

      // Don't retry on rate limit errors
      if (response.status === 429) {
        const error = new Error('Rate limit exceeded');
        (error as any).status = 429;
        throw error;
      }

      // Clone the response before checking if it's ok
      const responseClone = response.clone();

      if (!response.ok) {
        const errorText = await responseClone.text();
        console.error('Response not OK:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      attempt++;
      console.error(`Fetch attempt ${attempt} failed:`, error);
      
      // Don't retry rate limit errors
      if ((error as any).status === 429) {
        throw error;
      }
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      await new Promise(resolve => 
        setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000))
      );
    }
  }

  throw new Error('Max retries reached');
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage
  },
  global: {
    fetch: customFetch
  }
});

// Only log auth state changes
supabase.auth.onAuthStateChange((event) => {
  console.log('Auth state changed:', event);
});