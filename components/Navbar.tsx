import { AvatarIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Navbar() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-row w-full px-8 py-4 justify-between">
      <div>
        <h2>Headshots AI</h2>
      </div>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
              <AvatarIcon height={24} width={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>marfuen98@gmail.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action="/auth/sign-out" method="post">
             <DropdownMenuItem className="cursor-pointer">
              <button
                formAction="/auth/sign-out"
              >
                Log out
              </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}