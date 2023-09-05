"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./ui/button";

export function TrainModelZone() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback(async (acceptedFiles: any) => {
    setFiles([...acceptedFiles]);
  }, []);

  const trainModel = useCallback(async () => {
    const formData = new FormData();
    files?.forEach(file => {
      formData.append("image", file); // Add the image Blob to the form data
    });
    const response = await fetch("/leap/train-model", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log("Something went wrong! ", response?.statusText);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className="bg-slate-700 w-full h-full p-4 rounded-md justify-center align-middle cursor-pointer">
        <div className="outline-dashed outline-2 outline-gray-100 w-full h-full rounded-md p-4 flex justify-center align-middle">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="self-center">Drop the files here ...</p> :
              <p className="self-center">Drag some images here, or click to select</p>
          }
        </div>
      </div>
      <Button className="w-full" onClick={trainModel}>Train Model</Button>
    </>
  )
}