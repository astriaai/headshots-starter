import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { streamToString } from "@/lib/utils";
import Stripe from "stripe";
export const dynamic = "force-dynamic";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
if (!endpointSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-08-16",
  typescript: true,
});

const creditsPerPriceId: {
  [key: string]: number;
} = {
  "price_1NsYS7CMCmxSLOnrWjmE920O": 1,
  "price_1NsYY8CMCmxSLOnrhgdttBX2": 3,
  "price_1NsYZCCMCmxSLOnrZiw1mPXw": 5,
}

export async function POST(request: Request) {
  const headersObj = headers();
  const sig = headersObj.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 400, statusText: `Missing signature` }
    );
  }

  if (!request.body) {
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 400, statusText: `Missing body` }
    );
  }

  const rawBody = await streamToString(request.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret!);
  } catch (err) {
    const error = err as Error;
    console.log("Error verifying webhook signature: " + error.message);
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 400, statusText: `Webhook Error: ${error?.message}` }
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSessionCompleted.client_reference_id;

      console.log(checkoutSessionCompleted);
      console.log("userId: " + userId);

      if (!userId) {
        return NextResponse.json(
          {
            message: "error",
          },
          { status: 400, statusText: `Missing client_reference_id` }
        );
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSessionCompleted.id, { limit: 5 });
      const quantity = lineItems.data[0].quantity;
      const priceId = lineItems.data[0].price!.id;
      const creditsPerUnit = creditsPerPriceId[priceId];
      const totalCreditsPurchased = quantity! * creditsPerUnit;
      console.log("totalCreditsPurchased: " + totalCreditsPurchased);

      const { data: existingCredits } = await supabase.from("credits").select("*").eq("user_id", userId).single();

      // If user has existing credits, add to it.
      if (existingCredits) {
        const newCredits = existingCredits.credits + totalCreditsPurchased;
        const {
          data, error,
        } = await supabase.from("credits").update({
          credits: newCredits,
        }).eq("user_id", userId);

        if (error) {
          console.log(error);
          return NextResponse.json(
            {
              message: "error",
            },
            { status: 400, statusText: `Error updating credits: ${error}\n ${data}` }
          );
        }

        return NextResponse.json(
          {
            message: "success",
          },
          { status: 200, statusText: "Success" }
        );
      } else {
        // Else create new credits row.
        const {
          data, error,
        } = await supabase.from("credits").insert({
          user_id: userId,
          credits: totalCreditsPurchased,
        });

        if (error) {
          console.log(error);
          return NextResponse.json(
            {
              message: "error",
            },
            { status: 400, statusText: `Error creating credits: ${error}\n ${data}` }
          );
        }
      }

      return NextResponse.json(
        {
          message: "success",
        },
        { status: 200, statusText: "Success" }
      );

    default:
      return NextResponse.json(
        {
          message: "error",
        },
        { status: 400, statusText: `Unhandled event type ${event.type}` }
      );
  }
}
