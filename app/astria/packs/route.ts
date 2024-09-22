import { NextResponse } from "next/server";
import axios from "axios";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Set dynamic route handling
export const dynamic = "force-dynamic";

// Environment Variables
const API_KEY = process.env.ASTRIA_API_KEY;
const QUERY_TYPE = process.env.PACK_QUERY_TYPE || "users"; // Default to 'users'
const DOMAIN = "https://api.astria.ai";

// Check if API Key is missing
if (!API_KEY) {
  throw new Error("MISSING API_KEY!");
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  
  try {
    // Authorization header
    const headers = { Authorization: `Bearer ${API_KEY}` };

    // Define the endpoints based on the query type
    const endpoints: string[] = [];

    if (QUERY_TYPE === "users" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/packs`);
    }

    if (QUERY_TYPE === "gallery" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/gallery/packs`);
    }

    // Make concurrent requests
    const responses = await Promise.all(
      endpoints.map((url) => axios.get(url, { headers }))
    );

    // Combine the data from both responses
    const combinedData = responses.flatMap((response) => response.data);
    
    // Return the combined data as JSON
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching packs:", error);

    // Return error response
    return NextResponse.json(
      {
        message: "Failed to fetch packs.",
      },
      { status: 500 }
    );
  }
}
