import { LeapWebhookImage } from "@/types/leap";
import { Database } from "@/types/supabase";
import { Leap } from "@leap-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const leapApiKey = process.env.LEAP_API_KEY;
// For local development, recommend using an Ngrok tunnel for the domain
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

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

if (!leapWebhookSecret) {
  throw new Error("MISSING LEAP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const incomingData = await request.json();
  // console.log(incomingData, "train model webhook incomingData");

  const { output } = incomingData;
  // console.log(output, "train model webhook result");

  const workflowRunId = incomingData.id;
  // console.log(workflowRunId, "workflowRunId");

  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get("user_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");
  const model_type = urlObj.searchParams.get("model_type");

  if (!leapApiKey) {
    return NextResponse.json(
      {
        message: "Missing API Key: Add your Leap API Key to generate headshots",
      },
      {
        status: 500,
      }
    );
  }

  if (!webhook_secret) {
    return NextResponse.json(
      {
        message: "Malformed URL, no webhook_secret detected!",
      },
      { status: 500 }
    );
  }

  if (webhook_secret.toLowerCase() !== leapWebhookSecret?.toLowerCase()) {
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
    if (incomingData.status === "completed") {
      // Send Email
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
        .eq("modelId", workflowRunId)
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

      // Here we join all of the arrays into one.
      const allHeadshots = [
        ...output.headshots_part_1,
        ...output.headshots_part_2,
        ...output.headshots_part_3,
        ...output.headshots_part_4,
      ];

      console.log({ allHeadshots });

      const modelId = modelUpdated[0].id;

      await Promise.all(
        allHeadshots.map(async (image) => {
          const { error: imageError } = await supabase.from("images").insert({
            modelId: Number(modelId),
            uri: image,
          });
          if (imageError) {
            console.error({ imageError });
          }
        })
      );
      return NextResponse.json(
        {
          message: "success",
        },
        { status: 200, statusText: "Success" }
      );
    } else {
      // Send Email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "noreply@headshots.tryleap.ai",
          to: user?.email ?? "",
          subject: "Your model failed to train!",
          html: `<h2>We're writing to notify you that your model training failed!. Since this failed, you will not be billed for it</h2>`,
        });
      }

      // Update model status to failed.
      await supabase
        .from("models")
        .update({
          status: "failed",
        })
        .eq("modelId", workflowRunId);

      if (stripeIsConfigured) {
        // Refund the user.
        const { data } = await supabase
          .from("credits")
          .select("*")
          .eq("user_id", user.id)
          .single();
        const credits = data!.credits;

        // We are adding a credit back to the user, since we charged them for the model training earlier. Since it failed we need to refund it.
        const addCredit = credits + 1;
        const { error: updateCreditError } = await supabase
          .from("credits")
          .update({ credits: addCredit })
          .eq("user_id", user.id);

        if (updateCreditError) {
          console.error({ updateCreditError });
          return NextResponse.json(
            {
              message: "Something went wrong!",
            },
            { status: 500 }
          );
        }

        console.log("Refunded user 1 credit! User Id: ", user.id);
      }
    }
    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
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
