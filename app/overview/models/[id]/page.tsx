import Login from "@/app/login/page";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("id", Number(params.id))
    .eq("user_id", user.id)
    .single();

  if (!model) {
    redirect("/overview");
  }

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("modelId", model.id);

  return (
    <div id="train-model-container" className="w-full h-full px-20 py-10">
      <Link href="/overview" className="text-sm">
        <Button variant={"outline"}>
          <FaArrowLeft className="mr-2" />
          Go Back
        </Button>
      </Link>
      <div className="flex flex-col w-full mt-4">
        <h1 className="text-3xl self-center text-center mx-auto">
          {model.name}
        </h1>
        <div className="flex flex-1 flex-col w-full gap-8">
          <b>Status: {model.status} {model.status === "processing" && <Icons.spinner className="h-4 w-4 animate-spin ml-2 inline-block" />}</b>
          {model.status === "finished" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="text-xl">Samples</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {images?.map((image) => (
                  <div key={image.id}>
                    <img height={256} width={256} src={image.uri} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
