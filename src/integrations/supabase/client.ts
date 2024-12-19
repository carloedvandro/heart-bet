import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDAzMjUsImV4cCI6MjA0ODk3NjMyNX0.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 1000; // 1 second
  let attempt = 0;
  let lastError;

  while (attempt < MAX_RETRIES) {
    try {
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

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // Increased timeout to 15 seconds

      console.log('Supabase Request:', {
        url: url.toString(),
        method: init?.method || 'GET',
      });

      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
        credentials: 'include', // Add credentials inclusion
      });

      clearTimeout(timeout);

      console.log('Supabase Response:', {
        url: url.toString(),
        status: response.status,
        statusText: response.statusText
      });

      if (response.status === 429) {
        const error = new Error('Rate limit exceeded');
        (error as any).status = 429;
        throw error;
      }

      if (!response.ok) {
        const errorClone = response.clone();
        const errorText = await errorClone.text();
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
      lastError = error;
      attempt++;
      console.error(`Fetch attempt ${attempt} failed:`, error);
      
      if ((error as any).status === 429 || error.name === 'AbortError') {
        const retryDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      if (attempt === MAX_RETRIES) {
        console.error('All retry attempts failed:', error);
        throw error;
      }
      
      // Exponential backoff with max of 5 seconds
      const retryDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError || new Error('Max retries reached');
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: localStorage,
  },
  global: {
    fetch: customFetch,
    headers: {
      'x-client-info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Log auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, session });
});