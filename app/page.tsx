import TrainModelZone from '@/components/TrainModel'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Login from './login/page'
import { cookies } from 'next/headers'
import ModelsTable from '@/components/ModelsTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <div className='flex flex-row w-full justify-between align-middle text-center'>
          <h1>Your models</h1>
          <Link href="/models/train">
            <Button className="ml-4">Train model</Button>
          </Link>
        </div>
        <ModelsTable />
      </div>
    </div>
  )
}
