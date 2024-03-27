import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!resendApiKey) {
  console.warn(
    "We detected that the RESEND_API_KEY is missing from your environment variables. The app should still work but email notifications will not be sent. Please add your RESEND_API_KEY to your environment variables if you want to enable email notifications."
  );
}

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  type TuneData = {
    id: number;
    title: string;
    name: string;
    steps: null;
    trained_at: null;
    started_training_at: null;
    created_at: string;
    updated_at: string;
    expires_at: null;
  };

  const incomingData = (await request.json()) as { tune: TuneData };

  const { tune } = incomingData;

  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get("user_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");

  if (!webhook_secret) {
    return NextResponse.json(
      {
        message: "Malformed URL, no webhook_secret detected!",
      },
      { status: 500 }
    );
  }

  if (webhook_secret.toLowerCase() !== appWebhookSecret?.toLowerCase()) {
    return NextResponse.json(
      {
        message: "Unauthorized!",
      },
      { status: 401 }
    );
  }

  if (!user_id) {
    return NextResponse.json(
      {
        message: "Malformed URL, no user_id detected!",
      },
      { status: 500 }
    );
  }

  const supabase = createClient<Database>(
    supabaseUrl as string,
    supabaseServiceRoleKey as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(user_id);

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 401 }
    );
  }

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "noreply@headshots.tryleap.ai",
        to: user?.email ?? "",
        subject: "Your model was successfully trained!",
        html: `<h2>We're writing to notify you that your model training was successful! 1 credit has been used from your account.</h2>`,
      });
    }

    const { data: modelUpdated, error: modelUpdatedError } = await supabase
      .from("models")
      .update({
        status: "finished",
      })
      .eq("modelId", tune.id)
      .select();

    if (modelUpdatedError) {
      console.error({ modelUpdatedError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    if (!modelUpdated) {
      console.error("No model updated!");
      console.error({ modelUpdated });
    }

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200, statusText: "Success" }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
