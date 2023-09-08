import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Login from "../login/page";
import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";

export const revalidate = 0;

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>User not found</div>;
  }

  const { data: models } = await supabase
    .from("models")
    .select(
      `*, samples (
      *
    )`
    )
    .eq("user_id", user.id);

  console.log(models);

  return <ClientSideModelsList serverModels={models ?? []} />;
}
