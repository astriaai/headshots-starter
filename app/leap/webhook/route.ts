import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic'

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("MISSING RESEND_API_KEY!");
}

export async function POST(request: Request) {
  const resend = new Resend(resendApiKey);
  const incomingData = await request.json();
  const { state, user_id } = incomingData;

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.from('users').select('*').eq('user_id', user_id).single();

  console.log({ user_id, user, state });

  if (!user) {
    return NextResponse.json({}, { status: 401, statusText: "User not found!" })
  }

  switch (state) {
    case "finished":
      // Send Email
      resend.emails.send({
        from: 'noreply@headshots.tryleap.ai',
        to: user.email,
        subject: 'Your model was successfully trained!',
        html: `<h2>We're writing to notify you that your model training was successful!</h2>`
      });
    case "failed":
      // Send Email
      resend.emails.send({
        from: 'noreply@headshots.tryleap.ai',
        to: user.email,
        subject: 'Your model failed to train!',
        html: `<h2>We're writing to notify you that your model training failed!.</h2>`
      });
    default:
      // Send Email
      null;
  }

  return NextResponse.json({
    message: "success"
  }, { status: 200, statusText: "Success" })
}
