import { Leap } from '@leap-ai/sdk';
import { NextResponse } from 'next/server'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers'

const leapApiKey = process.env.LEAP_API_KEY;
const webhookUrl = process.env.LEAP_WEBHOOK_URL;

if (!leapApiKey) {
  throw new Error("MISSING LEAP_API_KEY!");
}

if (!webhookUrl) {
  throw new Error("MISSING LEAP_WEBHOOK_URL!");
}

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const incomingFormData = await request.formData();
  const images = incomingFormData.get("images") as unknown as File[];
  const supabase = createServerActionClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized!" })
  }

  if (images?.length < 1) {
    return NextResponse.json({
      message: "Missing sample images!"
    }, { status: 500, statusText: "Missing sample images!" })
  }

  const leap = new Leap({
    accessToken: leapApiKey,
  });

  try {
    await leap.imageModels.trainModel({
      imageSampleFiles: images as unknown as File[],
      webhookUrl: `${webhookUrl}?user_id=${user.id}`,
    })
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      message: "Something went wrong!"
    }, { status: 500, statusText: "Something went wrong!" })
  }

  return NextResponse.json({
    message: "success"
  }, { status: 200, statusText: "Success" })
}
