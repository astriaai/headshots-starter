import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import CreditsPageClient from "./components/CreditsPageClient";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow access with or without login
  // If logged in, use user data; otherwise collect email
  return (
    <CreditsPageClient user={user} />
  );
}
