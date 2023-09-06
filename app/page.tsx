import TrainModelZone from '@/components/TrainModel'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Login from './login/page'
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
      <div id="train-model-container" className="w-full h-full px-20 py-10">
        <h2>Train Model</h2>
        <div className='bg-slate-500 w-80 h-80 rounded-md mt-2'>
          <TrainModelZone />
        </div>
      </div>
    </div>
  )
}
