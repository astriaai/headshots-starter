"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.string().min(1).max(50),
})

export default function TrainModelZone() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    trainModel();
  }

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
    formData.append("name", form.getValues("name"));
    formData.append("type", form.getValues("type"));
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

    router.push("/");
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  }});

  return (
    <div className="h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full py-5 rounded-md">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My First Model" {...field} className="outline-1 outline max-w-screen-sm" />
                </FormControl>
                <FormDescription>
                  This helps you identify the model later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full py-5 rounded-md">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="person" {...field} className="outline-1 outline max-w-screen-sm" />
                </FormControl>
                <FormDescription>
                  This helps the model identify what it is looking at.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div {...getRootProps()} className="h-96 py-5 rounded-md justify-center align-middle cursor-pointer">
            <div className="outline-dashed outline-2 outline-gray-100 w-full h-full rounded-md p-4 flex justify-center align-middle">
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p className="self-center">Drop the files here ...</p> :
                  <p className="self-center">Drag some images here, or click to select</p>
              }
            </div>
          </div>
          <Button type="submit" className="w-full">Train Model</Button>
        </form>
      </Form>
    </div>
  )
}