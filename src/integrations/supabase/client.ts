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
      // Get the current session
      const session = JSON.parse(localStorage.getItem('sb-' + supabaseUrl.split('//')[1] + '-auth-token') || '{}');
      const accessToken = session?.access_token;

      const headers = new Headers(init?.headers || {});
      
      // Set the Authorization header with the access token if available
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      
      // Set required headers if not present
      if (!headers.has('apikey')) {
        headers.set('apikey', supabaseKey);
      }
      
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
          body: errorText,
          session: session // Log session info for debugging
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
    storage: localStorage,
    storageKey: 'sb-' + supabaseUrl.split('//')[1] + '-auth-token'
  },
  global: {
    fetch: customFetch
  }
});

// Log auth state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, session });
});