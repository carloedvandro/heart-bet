import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDAzMjUsImV4cCI6MjA0ODk3NjMyNX0.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

const storageKey = 'sb-' + supabaseUrl.split('//')[1] + '-auth-token';

const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Get the current session
      const sessionStr = localStorage.getItem(storageKey);
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const accessToken = session?.access_token;

      const headers = new Headers(init?.headers || {});
      
      // Set the Authorization header with the access token if available
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      
      // Set required headers if not present
      headers.set('apikey', supabaseKey);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      headers.set('Prefer', 'return=minimal'); // Add this to handle empty results better

      const response = await fetch(url, {
        ...init,
        headers,
        credentials: 'include' // Add this to handle cookies properly
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

        // Special handling for 406 errors (no rows found)
        if (response.status === 406) {
          return response; // Let the caller handle this case
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      attempt++;
      console.error(`Fetch attempt ${attempt} failed:`, error);
      
      if ((error as any).status === 429) {
        throw error;
      }
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      // Exponential backoff with max of 5 seconds
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
    storageKey
  },
  global: {
    fetch: customFetch
  }
});

// Enhanced auth state change logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { 
    event, 
    session,
    timestamp: new Date().toISOString(),
    hasAccessToken: !!session?.access_token
  });

  // Automatically create profile if it doesn't exist on sign in
  if (event === 'SIGNED_IN' && session?.user) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!data && !error) {
          // Profile doesn't exist, create it
          supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                balance: 0,
                is_admin: false
              }
            ])
            .then(({ error: insertError }) => {
              if (insertError) {
                console.error('Error creating profile:', insertError);
              }
            });
        }
      });
  }
});