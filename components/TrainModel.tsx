"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export default function TrainModelZone() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast()
  const onDrop = useCallback(async (acceptedFiles: any) => {
    setFiles(acceptedFiles);
    toast({
      title: "Images uploaded",
      description: "The images were uploaded successfully.",
      duration: 5000,
    })
  }, []);

  const trainModel = useCallback(async () => {
    const formData = new FormData();
    files?.forEach(file => {
      formData.append("image", file); // Add the image Blob to the form data
    });
    console.log("formData", formData.getAll("image"));
    const response = await fetch("/leap/train-model", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log("Something went wrong! ", response?.statusText);
      toast({
        title: "Something went wrong!",
        description: response?.statusText,
        duration: 5000,
      })
      return;
    }

    toast({
      title: "Model queued for training",
      description: "The model was queued for training. You will receive an email when the model is ready to use.",
      duration: 5000,
    })
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  } });

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