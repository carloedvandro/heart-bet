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

      const headers = new Headers({
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=minimal'
      });

      if (init?.headers) {
        const customHeaders = new Headers(init.headers);
        customHeaders.forEach((value, key) => headers.set(key, value));
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

      // Don't retry on authentication errors
      if (response.status === 400 || response.status === 401) {
        const errorText = await response.text();
        console.error('Authentication error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(errorText);
      }

      // Don't retry on rate limit errors
      if (response.status === 429) {
        const error = new Error('Rate limit exceeded');
        (error as any).status = 429;
        throw error;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).body = errorText;
        throw error;
      }

      // Clone the response before using it
      const clonedResponse = response.clone();
      
      // Log the response body for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const responseBody = await clonedResponse.text();
        console.log('Response body:', responseBody);
      }

      return response;
    } catch (error) {
      attempt++;
      console.error(`Fetch attempt ${attempt} failed:`, error);
      
      if ((error as any).status === 400 || 
          (error as any).status === 401 || 
          (error as any).status === 429) {
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
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  global: {
    fetch: customFetch
  }
});

// Only log auth state changes
supabase.auth.onAuthStateChange((event) => {
  console.log('Auth state changed:', event);
});