"use client"

import { Database } from "@/types/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModelsTable from "./ModelsTable";
import { FaImages } from "react-icons/fa";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { modelRow } from "@/types/utils";

type ClientSideModelsListProps = {
  serverModels: modelRow[] | [];
}

export default function ClientSideModelsList({ serverModels }: ClientSideModelsListProps) {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
  const [models, setModels] = useState<modelRow[]>(serverModels);

  useEffect(() => {
    const channel = supabase.channel('realtime-models')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'models' },
      (payload: any) => {
        const dedupedModels = models.filter((model) => model.id !== payload.old?.id);
        setModels([...dedupedModels, payload.new as modelRow]);
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase, models, setModels]);

  return (
    <div id="train-model-container" className="w-full p-8">
      {models && models.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 w-full justify-between items-center text-center">
            <h1>Your models</h1>
            <Link href="/overview/models/train">
              <Button className="ml-4" size={"sm"}>
                Train model
              </Button>
            </Link>
          </div>
          <ModelsTable models={models} />
        </div>
      )}
      {models && models.length === 0 && (
        <div className="flex flex-col gap-4 items-center">
          <FaImages size={64} className="text-gray-500" />
          <h1 className="text-2xl">
            Get started by training your first model.
          </h1>
          <div>
            <Link href="/overview/models/train">
              <Button size={"lg"}>Train model</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}