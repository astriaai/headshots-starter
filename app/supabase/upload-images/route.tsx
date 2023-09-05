import { Leap } from '@leap-ai/sdk';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const leapApiKey = process.env.LEAP_API_KEY;
  const webhookUrl = process.env.LEAP_WEBHOOK_URL;
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const imageUrls = formData.get("imageUrls")

  if (!imageUrls) {
    return NextResponse.redirect(requestUrl.origin, {
      statusText: "Missing image urls",
      status: 500,
    })
  }

  const leap = new Leap({
    // Defining the base path is optional and defaults to https://api.tryleap.ai
    // basePath: "https://api.tryleap.ai",
    accessToken: leapApiKey,
  });

  const result = await leap.imageModels.trainModel({
    imageSampleUrls: imageUrls as unknown as string[],
    webhookUrl,
  })

  return NextResponse.redirect(requestUrl.origin, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}
