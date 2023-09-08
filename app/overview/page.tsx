import ModelsTable from "@/components/ModelsTable";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Login from "../login/page";
import { FaImages } from "react-icons/fa";

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
    <div
      id="train-model-container"
      className="flex flex-grow w-full h-full px-20 py-10 justify-center items-center"
    >
      {models && models.length > 0 && (
        <div>
          <div className="flex flex-row w-full justify-between align-middle text-center">
            <h1>Your models</h1>
            <Link href="/overview/models/train">
              <Button className="ml-4">Train model</Button>
            </Link>
          </div>
          <ModelsTable models={models} />
        </div>
      )}
      {models && models.length === 0 && (
        <div className="flex flex-col gap-4 items-center">
          <FaImages size={64} className="text-gray-500" />
          <h1 className="text-2xl">
            Get started by training your first model.
          </h1>
          <div>
            <Link href="/overview/models/train">
              <Button size={"lg"}>Train model</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
