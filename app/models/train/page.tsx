import Login from '@/app/login/page';
import TrainModelZone from '@/components/TrainModel'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <Login />
  }

  return (
    <div className='flex flex-1 w-full h-screen flex-col'>
      <div id="train-model-container" className="w-full h-full px-20 py-10 max-w-screen-md">
        <h1>Train Model</h1>
        <TrainModelZone />
      </div>
    </div>
  )
}
