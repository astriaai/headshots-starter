import { AvatarIcon } from "@radix-ui/react-icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Navbar() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-row w-full px-8 py-4 justify-between">
      <Link href="/">
        <h2>Headshots AI</h2>
      </Link>
      {!user && (
        <Link href="/login">
          <Button>Login / Signup</Button>
        </Link>
      )}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <AvatarIcon height={24} width={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>marfuen98@gmail.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action="/auth/sign-out" method="post">
              <Button type="submit" className="w-full text-left">
                Log out
              </Button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
