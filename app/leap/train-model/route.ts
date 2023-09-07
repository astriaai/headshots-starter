import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

const leapApiKey = process.env.LEAP_API_KEY;
const webhookUrl = process.env.LEAP_WEBHOOK_URL;

if (!leapApiKey) {
  throw new Error("MISSING LEAP_API_KEY!");
}

if (!webhookUrl) {
  throw new Error("MISSING LEAP_WEBHOOK_URL!");
}

export async function POST(request: Request) {
  const incomingFormData = await request.formData();
  const images = incomingFormData.getAll("image") as File[];
  const type = incomingFormData.get("type") as string;
  const name = incomingFormData.get("name") as string;
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized!" })
  }

  if (images?.length < 1) {
    return NextResponse.json({
      message: "Missing sample images!"
    }, { status: 500, statusText: "Missing sample images!" })
  }

  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageSampleFiles", image);
    });

    formData.append("testRequest", "true");
    formData.append('webhookUrl', `${webhookUrl}?user_id=${user.id}`);

    let options = { method: 'POST', headers: { accept: 'application/json', Authorization: `Bearer ${leapApiKey}` }, body: formData };
    const resp = await fetch(`https://api.tryleap.ai/api/v2/images/models/new`, options);

    const { status, statusText } = resp;

    console.log("formData", formData);
    console.log({ status, statusText });

    const { error: modelError } = await supabase.from("models").insert({
      user_id: user.id,
      name,
      type,
    });

    if (modelError) {
      console.log(modelError);
      return NextResponse.json({
        message: "Something went wrong!"
      }, { status: 500, statusText: "Something went wrong!" })
    }
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
