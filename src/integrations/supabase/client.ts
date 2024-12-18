import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDAzMjUsImV4cCI6MjA0ODk3NjMyNX0.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

// Create a custom fetch implementation with retries
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      // Add cache control headers
      const modifiedInit = {
        ...init,
        headers: {
          ...init?.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };

      const response = await fetch(input, modifiedInit);
      
      // Log response details for debugging
      console.log(`Supabase request attempt ${attempt + 1}:`, {
        url: input.toString(),
        status: response.status,
        ok: response.ok
      });

      return response;
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) throw error;
      
      // Add exponential backoff with jitter
      await new Promise(resolve => 
        setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000))
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
    storage: window.localStorage,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
    fetch: customFetch
  },
});

// Clear invalid session data on initialization
const initializeClient = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('No valid session found, clearing storage');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
  }
};

// Set up auth state change listener with improved error handling
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
  
  if (event === 'SIGNED_OUT') {
    // Clear all auth data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
    console.log('Cleared auth data due to:', event);
  } else if (event === 'SIGNED_IN' && session) {
    // Ensure the session is properly stored
    localStorage.setItem('supabase.auth.token', session.access_token);
    if (session.refresh_token) {
      localStorage.setItem('supabase.auth.refreshToken', session.refresh_token);
    }
    console.log('Updated session storage after sign in');
  }
});

initializeClient().catch(console.error);

export default supabase;