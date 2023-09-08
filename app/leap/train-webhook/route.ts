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
  const user_id = urlObj.searchParams.get("user_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");
  const model_type = urlObj.searchParams.get("model_type");

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
      await resend.emails.send({
        from: "noreply@headshots.tryleap.ai",
        to: user?.email ?? "",
        subject: "Your model was successfully trained!",
        html: `<h2>We're writing to notify you that your model training was successful!</h2>`,
      });

      const { data: modelUpdated, error: modelUpdatedError } = await supabase
        .from("models")
        .update({
          status: "finished",
        })
        .eq("modelId", result.id)
        .select();

      if (modelUpdatedError) {
        console.log(modelUpdatedError);
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500, statusText: "Something went wrong!" }
        );
      }

      if (!modelUpdated) {
        console.log("No model updated!");
        console.log({ modelUpdated });
      }

      const prompt = [
        "8k close up linkedin profile picture of @subject {model_type}, professional jack suite, professional headshots, photo-realistic, 4k, high-resolution image, workplace settings, upper body, modern outfit, professional suit, businessman, blurred background, glass building, office window",
        "8k linkedin professional profile photo of @subject {model_type} in a suit with studio lighting, bokeh, corporate portrait headshot photograph best corporate photography photo winner, meticulous detail, hyperrealistic, centered uncropped symmetrical beautiful",
        "8k portrait of realistic pencil drawing of a beautiful @subject {model_type}, accurately drawn circular eyes, accurately drawn circles, black and white, sketch, pencil strokes, pencil lines, paper texture, high resolution, high resolution textures, sharp features, 32k, super-resolution, sharp focus",
        "8k professional historical portrait photo of @subject {model_type} from 1860, sepia tone, meticulous detail, hyperrealistic, medium long hair, facial hair, centered uncropped symmetrical , daguerreotype, framed picture",
      ];

      const leap = new Leap({
        accessToken: leapApiKey,
      });

      for (let index = 0; index < 4; index++) {
        const { status, statusText } = await leap.images.generate({
          prompt: prompt[index].replace(
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
      await resend.emails.send({
        from: "noreply@headshots.tryleap.ai",
        to: user?.email ?? "",
        subject: "Your model failed to train!",
        html: `<h2>We're writing to notify you that your model training failed!.</h2>`,
      });

      await supabase
        .from("models")
        .update({
          status: "failed",
        })
        .eq("modelId", result.id);
    }
    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200, statusText: "Success" }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500, statusText: "Something went wrong!" }
    );
  }
}
