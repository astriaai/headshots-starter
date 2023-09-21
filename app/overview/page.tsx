import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user }, error,
  } = await supabase.auth.getUser();

  console.log({user});
  console.log({error});

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

  return <ClientSideModelsList serverModels={models ?? []} />;
}
