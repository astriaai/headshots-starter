import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Login from "../login/page";
import ClientSideModelsList from "@/components/ClientSideModelsList";

export const revalidate = 0;

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  const { data: models } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", user.id);

  return (
    <ClientSideModelsList serverModels={models ?? []} />
  );
}
