import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ModelsTable from '@/components/ModelsTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Login from '@/app/login/page';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

export default async function Index({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: {user} } = await supabase.auth.getUser();

  if (!searchParams?.id) {
    redirect('/overview');
  }

  if (!user) {
    return <Login />
  }

  const { data: model } = await supabase.from('models').select('*').eq('id', searchParams?.id).eq("user_id", user.id).single();

  if (!model) {
    redirect('/overview');
  }

  return (
    <div id="train-model-container" className="w-full h-full px-20 py-10">
      <div className='flex flex-row w-full justify-between align-middle text-center'>
        <h1>Viewing model {model.name}</h1>
      </div>
    </div>
  )
}
