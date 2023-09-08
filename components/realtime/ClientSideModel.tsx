"use client"

import { Icons } from "@/components/icons";
import { Database } from "@/types/supabase";
import { imageRow, modelRow } from "@/types/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type ClientSideModelProps = {
  serverModel: modelRow;
  serverImages: imageRow[];
}

export default function ClientSideModel({ serverModel, serverImages }: ClientSideModelProps) {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
  const [model, setModel] = useState<modelRow>(serverModel);

  useEffect(() => {
    const channel = supabase.channel('realtime-model')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'models' },
      (payload: any) => {
        setModel(payload.new as modelRow);
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase, model, setModel]);

  return (
    <div id="train-model-container" className="w-full h-full px-20 py-10">
      <div className="flex flex-col w-full mt-4">
        <h1 className="text-3xl self-center text-center mx-auto">
          {model.name}
        </h1>
        <div className="flex flex-1 flex-col w-full gap-8">
          <b>Status: {model.status} {model.status === "processing" && <Icons.spinner className="h-4 w-4 animate-spin ml-2 inline-block" />}</b>
          {model.status === "finished" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="text-xl">Samples</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {serverImages?.map((image) => (
                  <div key={image.id}>
                    <img height={256} width={256} src={image.uri} className="rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}