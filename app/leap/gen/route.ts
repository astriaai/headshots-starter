import { Leap } from "@leap-ai/sdk";
import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const prompt = [
    "8k close up linkedin profile picture of @subject woman, professional jack suite, professional headshots, photo-realistic, 4k, high-resolution image, workplace settings, upper body, modern outfit, professional suit, businessman, blurred background, glass building, office window",
    "8k linkedin professional profile photo of @subject woman in a suit with studio lighting, bokeh, corporate portrait headshot photograph best corporate photography photo winner, meticulous detail, hyperrealistic, centered uncropped symmetrical beautiful",
    "8k portrait of realistic pencil drawing of a beautiful @subject woman, accurately drawn circular eyes, accurately drawn circles, black and white, sketch, pencil strokes, pencil lines, paper texture, high resolution, high resolution textures, sharp features, 32k, super-resolution, sharp focus",
    "8k professional historical portrait photo of @subject woman from 1860, sepia tone, meticulous detail, hyperrealistic, medium long hair, facial hair, centered uncropped symmetrical , daguerreotype, framed picture",
  ];

  const leap = new Leap({
    accessToken: leapApiKey,
  });

  for (let index = 0; index < 4; index++) {
    const { status, statusText } = await leap.images.generate({
      prompt: prompt[index],
      numberOfImages: 4,
      height: 512,
      width: 512,
      steps: 50,
      negativePrompt:
        "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
      modelId: "d1d336a8-64c7-42cd-b4a2-1e7c93a1d042",
      promptStrength: 7.5,
      webhookUrl: `${leapImageWebhookUrl}?user_id=${"e31e31ea-fee9-4218-945f-ad9bdc488b09"}&model_id=${"d1d336a8-64c7-42cd-b4a2-1e7c93a1d042"}&webhook_secret=${leapWebhookSecret}&model_db_id=${"28"}`,
    });
    console.log({ status, statusText });
  }

  return NextResponse.json(
    {
      message: "success",
    },
    { status: 200, statusText: "Success" }
  );
}
