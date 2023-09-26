import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const leapApiKey = process.env.LEAP_API_KEY;
const webhookUrl = process.env.LEAP_WEBHOOK_URL;
const leapWebhookSecret = process.env.LEAP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

if (!webhookUrl) {
  throw new Error("MISSING LEAP_WEBHOOK_URL!");
}

if (!leapWebhookSecret) {
  throw new Error("MISSING LEAP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const incomingFormData = await request.formData();
  const images = incomingFormData.getAll("image") as File[];
  const type = incomingFormData.get("type") as string;
  const name = incomingFormData.get("name") as string;
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401, statusText: "Unauthorized!" });
  }

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

  console.log({ stripeIsConfigured });
  if (stripeIsConfigured) {
    const { error: creditError, data: credits } = await supabase
      .from("credits")
      .select("credits")
      .eq("user_id", user.id);

    if (creditError) {
      console.error({ creditError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500, statusText: "Something went wrong!" }
      );
    }

    if (credits.length === 0) {
      // create credits for user.
      const { error: errorCreatingCredits } = await supabase.from("credits").insert({
        user_id: user.id,
        credits: 0,
      });

      if (errorCreatingCredits) {
        console.error({ errorCreatingCredits });
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500, statusText: "Something went wrong!" }
        );
      }

      return NextResponse.json(
        {
          message: "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500, statusText: "Not enough credits" }
      );
    } else if (credits[0]?.credits < 1) {
      return NextResponse.json(
        {
          message: "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500, statusText: "Not enough credits" }
      );
    } else {
      const subtractedCredits = credits[0].credits - 1;
      const { error: updateCreditError, data } = await supabase
        .from("credits")
        .update({ credits: subtractedCredits })
        .eq("user_id", user.id)
        .select("*");

      console.log({ data });
      console.log({ subtractedCredits })

      if (updateCreditError) {
        console.error({ updateCreditError });
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500, statusText: "Something went wrong!" }
        );
      }
    }
  }

  if (images?.length < 4) {
    return NextResponse.json(
      {
        message: "Upload at least 4 sample images",
      },
      { status: 500, statusText: "Upload at least 4 sample images" }
    );
  }

  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageSampleFiles", image);
    });

    formData.append(
      "webhookUrl",
      `${webhookUrl}?user_id=${user.id}&webhook_secret=${leapWebhookSecret}&model_type=${type}`
    );

    let options = {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${leapApiKey}`,
      },
      body: formData,
    };
    const resp = await fetch(
      `https://api.tryleap.ai/api/v2/images/models/new`,
      options
    );

    const { status, statusText } = resp;
    const body = (await resp.json()) as {
      id: string;
      imageSamples: string[];
    };

    const { error: modelError, data } = await supabase
      .from("models")
      .insert({
        modelId: body.id,
        user_id: user.id,
        name,
        type,
      })
      .select("id")
      .single();

    if (modelError) {
      console.error(modelError);
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500, statusText: "Something went wrong!" }
      );
    }

    const { error: samplesError } = await supabase.from("samples").insert(
      body.imageSamples.map((sample) => ({
        modelId: data.id,
        uri: sample,
      }))
    );

    if (samplesError) {
      console.error(samplesError);
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500, statusText: "Something went wrong!" }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500, statusText: "Something went wrong!" }
    );
  }

  return NextResponse.json(
    {
      message: "success",
    },
    { status: 200, statusText: "Success" }
  );
}
