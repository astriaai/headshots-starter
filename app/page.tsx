import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/overview");
  }

  return (
    <div className="flex flex-1 w-full flex-col justify-center items-center">
      <div
        id="train-model-container"
        className="flex flex-col gap-4 items-center p-16"
      >
        <h1 className="text-3xl">
          Get professional headshots in minutes with AI
        </h1>
        <div>
          <Link href="/login">
            <Button size={"lg"}>Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
