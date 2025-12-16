import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Persistent Supabase client for browser
export const createPersistentSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
      },
    }
  );
};

// Export singleton instance for client components
let supabaseInstance: ReturnType<typeof createPersistentSupabaseClient> | null = null;

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('This function should only be called on the client side');
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createPersistentSupabaseClient();
  }
  
  return supabaseInstance;
};
