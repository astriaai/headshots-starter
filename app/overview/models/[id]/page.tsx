import Login from "@/app/login/page";
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

  return (
    <div id="train-model-container" className="w-full h-full px-20 py-10">
      <Link href="/overview" className="text-sm">
        <Button variant={"outline"}>
          <FaArrowLeft className="mr-2" />
          Go Back
        </Button>
      </Link>
      <div className="flex flex-row w-full mt-4">
        <h1 className="text-3xl self-center text-center mx-auto">
          {model.name}
        </h1>
      </div>
    </div>
  );
}
