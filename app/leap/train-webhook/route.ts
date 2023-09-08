import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic'

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const leapApiKey = process.env.LEAP_API_KEY;
const leapImageWebhookUrl = process.env.LEAP_IMAGE_WEBHOOK_URL;
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;

if (!resendApiKey) {
  throw new Error("MISSING RESEND_API_KEY!");
}

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_ANON_KEY!");
}

if (!leapApiKey) {
  throw new Error("MISSING LEAP_API_KEY!");
}

if (!leapImageWebhookUrl) {
  throw new Error("MISSING LEAP_IMAGE_WEBHOOK_URL!");
}

if (!leapWebhookSecret) {
  throw new Error("MISSING LEAP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const resend = new Resend(resendApiKey);
  const incomingData = await request.json();
  const { result } = incomingData;
  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get('user_id');
  const webhook_secret = urlObj.searchParams.get('webhook_secret');

  console.log({ user_id, webhook_secret });

  if (!webhook_secret) {
    return NextResponse.json({}, { status: 500, statusText: "Malformed URL, no webhook_secret detected!" });
  }

  if (webhook_secret.toLowerCase() !== leapWebhookSecret?.toLowerCase()) {
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized!" });
  }

  if (!user_id) {
    return NextResponse.json({}, { status: 500, statusText: "Malformed URL, no user_id detected!" });
  }

  const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
  const { data: { user }, error } = await supabase.auth.admin.getUserById(user_id);

  if (error) {
    return NextResponse.json({}, { status: 401, statusText: error.message, })
  }

  if (!user) {
    return NextResponse.json({}, { status: 401, statusText: "User not found!" })
  }

  try {
    if (result.status === "finished") {
      // Send Email
      await resend.emails.send({
        from: 'noreply@headshots.tryleap.ai',
        to: user?.email ?? "",
        subject: 'Your model was successfully trained!',
        html: `<h2>We're writing to notify you that your model training was successful!</h2>`
      });

      await supabase.from("models").update({
        status: "finished",
      }).eq("id", result.id);

      const prompt = "8k portrait of professional photo, in an office setting, with a white background";
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('numberOfImages', "4");
      formData.append('webhookUrl', `${leapImageWebhookUrl}?user_id=${user.id}&model_id=${result.id}&webhook_secret=${leapWebhookSecret}`);

      let options = { method: 'POST', headers: { accept: 'application/json', Authorization: `Bearer ${leapApiKey}` }, body: formData };
      const resp = await fetch(`https://api.tryleap.ai/api/v1/images/models/${result.id}/inferences`, options);
      const { status, statusText } = resp;
      console.log({ status, statusText });

    } else {
      // Send Email
      await resend.emails.send({
        from: 'noreply@headshots.tryleap.ai',
        to: user?.email ?? "",
        subject: 'Your model failed to train!',
        html: `<h2>We're writing to notify you that your model training failed!.</h2>`
      });

      await supabase.from("models").update({
        status: "failed",
      }).eq("id", result.id);
    }
    return NextResponse.json({
      message: "success"
    }, { status: 200, statusText: "Success" })
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      message: "Something went wrong!"
    }, { status: 500, statusText: "Something went wrong!" })
  }
}
