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
      console.log('Fetch Request:', {
        url,
        method: init?.method || 'GET',
        headers: init?.headers,
        body: init?.body
      });

      const headers = new Headers(init?.headers || {});
      
      // Ensure we have the required headers
      if (!headers.has('apikey')) {
        headers.set('apikey', supabaseKey);
      }
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${supabaseKey}`);
      }

      const response = await fetch(url, {
        ...init,
        headers
      });

      console.log('Fetch Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Handle authentication errors
      if (response.status === 400 || response.status === 401) {
        const errorData = await response.clone().json().catch(() => null);
        console.error('Auth Error:', errorData);
        
        const error = new Error(errorData?.message || 'Authentication error');
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
      }

      // Handle rate limiting
      if (response.status === 429) {
        const error = new Error('Rate limit exceeded');
        (error as any).status = 429;
        throw error;
      }

      // Handle other errors
      if (!response.ok) {
        const errorText = await response.clone().text();
        console.error('Response Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        const error = new Error(errorText);
        (error as any).status = response.status;
        throw error;
      }

      return response;
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      
      // Don't retry auth errors or rate limits
      if ((error as any).status === 400 || 
          (error as any).status === 401 || 
          (error as any).status === 429) {
        throw error;
      }
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      // Exponential backoff
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
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  global: {
    fetch: customFetch
  }
});

// Log auth state changes
supabase.auth.onAuthStateChange((event) => {
  console.log('Auth state changed:', event);
});