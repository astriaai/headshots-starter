import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { Database } from './types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase environment variables are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not configured - skipping auth middleware')
    return res
  }
  
  try {
    // Create middleware client with persistent session enabled
    const supabase = createMiddlewareClient<Database>({ 
      req, 
      res,
      // Enable persistent session storage
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    })
    
    // Refresh session to keep user logged in (if exists)
    // This enables persistent sessions without enforcing login
    await supabase.auth.getSession()
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Don't block requests if auth fails
  }
  
  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
