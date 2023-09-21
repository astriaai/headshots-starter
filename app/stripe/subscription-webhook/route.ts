import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { streamToString } from "@/lib/utils";
export const dynamic = "force-dynamic";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  console.log({ headersObj });
  console.log({ sig });
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
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    const error = err as Error;
    console.log(err);
    return NextResponse.json(
      {
        message: "error",
      },
      { status: 400, statusText: `Webhook Error: ${error?.message}` }
    );
  }

  // const supabase = createRouteHandlerClient<Database>({ cookies });

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const userId = checkoutSessionCompleted.client_reference_id;

      console.log(checkoutSessionCompleted)

      if (!userId) {
        return NextResponse.json(
          {
            message: "error",
          },
          { status: 400, statusText: `Missing client_reference_id` }
        );
      }

      stripe.checkout.sessions.listLineItems(
        checkoutSessionCompleted.id,
        { limit: 5 },
        function (err: any, lineItems: any) {
          if (err) {
            console.log(err);
            return NextResponse.json(
              {
                message: "error",
              },
              { status: 400, statusText: `Error fetching line items` }
            );
          }
          const quantity = lineItems.data[0].quantity;
          const priceId = lineItems.data[0].price.id;
          const creditsPerUnit = creditsPerPriceId[priceId];
          const totalCreditsPurchased = quantity * creditsPerUnit;
          console.log("totalCreditsPurchased: " + totalCreditsPurchased);
          return NextResponse.json(
            {
              message: "success",
            },
            { status: 200, statusText: "Success" }
          );
        }
      );

      // const {
      //   data: { user }, error,
      // } = await supabase.credits.update({
      //   credits: 1,
      // }).eq('stripe_customer_id', checkoutSessionCompleted.customer);

      // Then define and call a function to handle the event checkout.session.completed
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}
