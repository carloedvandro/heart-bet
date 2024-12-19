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
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeout);

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
        throw error;
      }
      
      if (attempt === MAX_RETRIES) {
        console.error('All retry attempts failed:', error);
        throw error;
      }
      
      // Exponential backoff with max of 5 seconds
      await new Promise(resolve => 
        setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000))
      );
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
  },
  global: {
    fetch: customFetch
  }
});

// Add request/response interceptors for better debugging
supabase.rest.interceptors.response.use(
  (response) => {
    console.log('Supabase Response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.error('Supabase Error:', error);
    return Promise.reject(error);
  }
);