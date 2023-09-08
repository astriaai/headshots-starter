import ModelsTable from "@/components/ModelsTable";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: models } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <div id="train-model-container" className="w-full h-full px-20 py-10">
      {models && models.length > 0 && (
        <div>
          <div className="flex flex-row w-full justify-between align-middle text-center">
            <h1>Your models</h1>
            <Link href="/overview/train">
              <Button className="ml-4">Train model</Button>
            </Link>
          </div>
          <ModelsTable models={models} />
        </div>
      )}
      {models && models.length === 0 && (
        <div className="flex flex-col gap-2">
          <h1>You don't have any models yet, click here to get started</h1>
          <div>
            <Link href="/overview/train">
              <Button>Train model</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
