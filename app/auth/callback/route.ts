import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const next = requestUrl.searchParams.get("next") || "/";
  const error_description = requestUrl.searchParams.get("error_description");

  if (error) {
    console.log("error: ", {
      error,
      error_description,
      code,
    });
  }

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
      await supabase.auth.exchangeCodeForSession(code);

      // ater exchanging the code, we should check if the user has a feature-flag row and a credits now, if not, we should create one

      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "[login] [session] [500] Error getting user: ",
          userError
        );
        return NextResponse.redirect(
          `${requestUrl.origin}/login/failed?err=500`
        );
      }
    } catch (error) {
      if (isAuthApiError(error)) {
        console.error(
          "[login] [session] [500] Error exchanging code for session: ",
          error
        );
        return NextResponse.redirect(
          `${requestUrl.origin}/login/failed?err=AuthApiError`
        );
      } else {
        console.error("[login] [session] [500] Something wrong: ", error);
        return NextResponse.redirect(
          `${requestUrl.origin}/login/failed?err=500`
        );
      }
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}
