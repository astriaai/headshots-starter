import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

export default async function Index() {

   const supabase = createServerComponentClient({ cookies });

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/overview');
  }

  return (
    <div className='flex flex-1 w-full h-screen flex-col'>
      <div id="train-model-container" className="w-full h-full px-20 py-10">
    hello
      </div>
    </div>
  )
}
