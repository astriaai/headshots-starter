import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { streamToString } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const paddleSecretKey = process.env.PADDLE_SECRET_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

// Credit amount for different price IDs
const priceIdCredits: { [key: string]: number } = {
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || ""]: 5,
};

// Verify Paddle webhook signature
function verifyPaddleSignature(
  paddleSignature: string,
  body: string,
  secretKey: string
): boolean {
  try {
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(body)
      .digest("base64");
    
    return signature === paddleSignature;
  } catch (error) {
    console.error("Error verifying Paddle signature:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    console.log("Paddle webhook received");
    
    const headersObj = headers();
    const paddleSignature = headersObj.get("paddle-signature");

    if (!paddleSecretKey) {
      console.error("Missing PADDLE_SECRET_KEY");
      return NextResponse.json(
        { message: "Missing paddleSecretKey" },
        { status: 400 }
      );
    }

    if (!paddleSignature) {
      console.error("Missing paddle-signature header");
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 400 }
      );
    }

    if (!request.body) {
      console.error("Missing request body");
      return NextResponse.json(
        { message: "Missing body" },
        { status: 400 }
      );
    }

    const rawBody = await streamToString(request.body);

    // Verify webhook signature
    if (!verifyPaddleSignature(paddleSignature, rawBody, paddleSecretKey)) {
      console.error("Invalid Paddle signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    console.log("Paddle event type:", event.eventType);

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

    // Handle different Paddle events
    if (event.eventType === "subscription.created" || 
        event.eventType === "subscription.updated" ||
        event.eventType === "transaction.completed") {
      
      const data = event.data;
      const customerId = data.customerId || data.customer?.id;
      const priceId = data.items?.[0]?.priceId || data.priceId;
      const status = event.eventType === "transaction.completed" ? "completed" : "active";

      console.log("Processing payment:", { customerId, priceId, status });

      if (!customerId || !priceId) {
        console.error("Missing customer or price data");
        return NextResponse.json(
          { message: "Missing customer or price data" },
          { status: 400 }
        );
      }

      // Get credits for this price ID
      const credits = priceIdCredits[priceId] || 5;

      // Insert or update user credits in Supabase
      try {
        // First, get the current credits
        const { data: existingData, error: fetchError } = await supabase
          .from("user_credits")
          .select("id, credits")
          .eq("user_id", customerId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching user credits:", fetchError);
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("user_credits")
            .update({
              credits: existingData.credits + credits,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", customerId);

          if (updateError) {
            console.error("Error updating user credits:", updateError);
          } else {
            console.log("Credits updated for user:", customerId);
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from("user_credits")
            .insert({
              user_id: customerId,
              credits: credits,
            });

          if (insertError) {
            console.error("Error inserting user credits:", insertError);
          } else {
            console.log("New credit record created for user:", customerId);
          }
        }
      } catch (error) {
        console.error("Error processing credits:", error);
        // Don't fail the webhook - Paddle will retry
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // For unhandled event types, just acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Paddle webhook error:", error);
    return NextResponse.json(
      { message: "Webhook processing error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
