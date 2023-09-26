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
const leapImageWebhookUrl = process.env.LEAP_IMAGE_WEBHOOK_URL;
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

const prompts = [
  "8k close up linkedin profile picture of @subject {model_type}, professional jack suite, professional headshots, photo-realistic, 4k, high-resolution image, workplace settings, upper body, modern outfit, professional suit, business, blurred background, glass building, office window",
  "8k close up linkedin profile picture of @subject {model_type}, linkedin, professional jack suit, professional headshots, photo-realistic, 4k, high-resolution image, workplace settings, upper body, modern outfit, professional suit, business, blurred background, glass building, garden, bokeh",
  "8k linkedin professional profile photo of @subject {model_type} in a suit with studio lighting, bokeh, corporate portrait headshot photograph best corporate photography photo winner, meticulous detail, hyperrealistic, centered uncropped symmetrical beautiful",
  "8k professional headshot of @subject {model_type}, crisp details, studio backdrop, executive attire, confident posture, neutral expression, high-definition, corporate setting, sharp focus, ambient lighting, business professional, cityscape view",
];

if (!resendApiKey) {
  console.warn("We detected that the RESEND_API_KEY is missing from your environment variables. The app should still work but email notifications will not be sent. Please add your RESEND_API_KEY to your environment variables if you want to enable email notifications.");
}

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

if (!leapImageWebhookUrl) {
  throw new Error("MISSING LEAP_IMAGE_WEBHOOK_URL!");
}

if (!leapWebhookSecret) {
  throw new Error("MISSING LEAP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const incomingData = await request.json();
  const { result } = incomingData;
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
        statusText:
          "Missing API Key: Add your Leap API Key to generate headshots",
      }
    );
  }

  if (!webhook_secret) {
    return NextResponse.json(
      {},
      { status: 500, statusText: "Malformed URL, no webhook_secret detected!" }
    );
  }

  if (webhook_secret.toLowerCase() !== leapWebhookSecret?.toLowerCase()) {
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized!" });
  }

  if (!user_id) {
    return NextResponse.json(
      {},
      { status: 500, statusText: "Malformed URL, no user_id detected!" }
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
    return NextResponse.json({}, { status: 401, statusText: error.message });
  }

  if (!user) {
    return NextResponse.json(
      {},
      { status: 401, statusText: "User not found!" }
    );
  }

  try {
    if (result.status === "finished") {
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
        .eq("modelId", result.id)
        .select();

      if (modelUpdatedError) {
        console.error({ modelUpdatedError });
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500, statusText: "Something went wrong!" }
        );
      }

      if (!modelUpdated) {
        console.error("No model updated!");
        console.error({ modelUpdated });
      }

      const leap = new Leap({
        accessToken: leapApiKey,
      });

      for (let index = 0; index < prompts.length; index++) {
        const { status, statusText } = await leap.images.generate({
          prompt: prompts[index].replace(
            "{model_type}",
            (model_type as string) ?? ""
          ),
          numberOfImages: 4,
          height: 512,
          width: 512,
          steps: 50,
          negativePrompt:
            "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
          modelId: result.id,
          promptStrength: 7.5,
          webhookUrl: `${leapImageWebhookUrl}?user_id=${user.id}&model_id=${result.id}&webhook_secret=${leapWebhookSecret}&model_db_id=${modelUpdated[0]?.id}`,
        });

        console.log({ status, statusText });
      }
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
        .eq("modelId", result.id);

      if (stripeIsConfigured) {
        // Refund the user.
        const { data } = await supabase.from("credits").select("*").eq("user_id", user.id).single();
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
            { status: 500, statusText: "Something went wrong!" }
          );
        }

        console.log("Refunded user 1 credit! User Id: ", user.id);
      }
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
      { status: 500, statusText: "Something went wrong!" }
    );
  }
}
