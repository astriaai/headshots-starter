import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { streamToString } from "@/lib/utils";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

const oneCreditPriceId = process.env.STRIPE_PRICE_ID_ONE_CREDIT as string;
const threeCreditsPriceId = process.env.STRIPE_PRICE_ID_THREE_CREDITS as string;
const fiveCreditsPriceId = process.env.STRIPE_PRICE_ID_FIVE_CREDITS as string;

const creditsPerPriceId: {
  [key: string]: number;
} = {
  [oneCreditPriceId]: 1,
  [threeCreditsPriceId]: 3,
  [fiveCreditsPriceId]: 5,
};

export async function POST(request: Request) {
  console.log("Request from: ", request.url);
  console.log("Request: ", request);
  const headersObj = headers();
  const sig = headersObj.get("stripe-signature");

  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        message: `Missing stripeSecretKey`,
      },
      { status: 400 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-08-16",
    typescript: true,
  });

  if (!sig) {
    return NextResponse.json(
      {
        message: `Missing signature`,
      },
      { status: 400 }
    );
  }

  if (!request.body) {
    return NextResponse.json(
      {
        message: `Missing body`,
      },
      { status: 400 }
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
        message: `Webhook Error: ${error?.message}`,
      },
      { status: 400 }
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

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data
        .object as Stripe.Checkout.Session;
      const userId = checkoutSessionCompleted.client_reference_id;

      if (!userId) {
        return NextResponse.json(
          {
            message: `Missing client_reference_id`,
          },
          { status: 400 }
        );
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(
        checkoutSessionCompleted.id
      );
      const quantity = lineItems.data[0].quantity;
      const priceId = lineItems.data[0].price!.id;
      const creditsPerUnit = creditsPerPriceId[priceId];
      const totalCreditsPurchased = quantity! * creditsPerUnit;

      console.log({ lineItems });
      console.log({ quantity });
      console.log({ priceId });
      console.log({ creditsPerUnit });

      console.log("totalCreditsPurchased: " + totalCreditsPurchased);

      const { data: existingCredits } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If user has existing credits, add to it.
      if (existingCredits) {
        const newCredits = existingCredits.credits + totalCreditsPurchased;
        const { data, error } = await supabase
          .from("credits")
          .update({
            credits: newCredits,
          })
          .eq("user_id", userId);

        if (error) {
          console.log(error);
          return NextResponse.json(
            {
              message: `Error updating credits: ${error}\n ${data}`,
            },
            {
              status: 400,
            }
          );
        }

        return NextResponse.json(
          {
            message: "success",
          },
          { status: 200 }
        );
      } else {
        // Else create new credits row.
        const { data, error } = await supabase.from("credits").insert({
          user_id: userId,
          credits: totalCreditsPurchased,
        });

        if (error) {
          console.log(error);
          return NextResponse.json(
            {
              message: `Error creating credits: ${error}\n ${data}`,
            },
            {
              status: 400,
            }
          );
        }
      }

      return NextResponse.json(
        {
          message: "success",
        },
        { status: 200 }
      );

    default:
      return NextResponse.json(
        {
          message: `Unhandled event type ${event.type}`,
        },
        { status: 400 }
      );
  }
}
