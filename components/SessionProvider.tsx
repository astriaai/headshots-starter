'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Database } from '@/types/supabase';

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [isReady, setIsReady] = useState(false);

  // Initialize session persistence
  useEffect(() => {
    let isMounted = true;

    // Configure Supabase auth to use localStorage for persistence
    const initializeSession = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setIsReady(true);
          
          // If there's a session, keep the user logged in
          if (session) {
            console.log('✅ Session restored from storage - User is logged in');
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    initializeSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in - Session created');
          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          router.refresh();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Session token refreshed - User stays logged in');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Return children immediately - don't block rendering
  return <>{children}</>;
}
