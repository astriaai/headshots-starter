import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url))
}