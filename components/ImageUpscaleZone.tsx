"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaImages, FaDownload } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";


interface UpscaledImage {
  original: string;
  upscaled: string;
  filename: string;
  recordId?: number;
  provider?: string;
}

type UpscaleProvider = 'fal' | 'clipdrop';

export default function ImageUpscaleZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [upscaledImages, setUpscaledImages] = useState<UpscaledImage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [upscaleProvider, setUpscaleProvider] = useState<UpscaleProvider>('clipdrop'); // Default to CLIPDROP
  const { toast } = useToast();

  // Get user ID from Supabase on component mount
  useEffect(() => {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };

    getUser();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter(file => 
        file.type.startsWith('image/')
      );

      if (imageFiles.length !== acceptedFiles.length) {
        toast({
          title: "Invalid files",
          description: "Only image files are allowed.",
          duration: 5000,
        });
      }

      if (imageFiles.length + files.length > 10) {
        toast({
          title: "Too many images",
          description: "You can only upload up to 10 images at once.",
          duration: 5000,
        });
        return;
      }

      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const newSize = imageFiles.reduce((acc, file) => acc + file.size, 0);

      if (totalSize + newSize > 50 * 1024 * 1024) {
        toast({
          title: "Files too large",
          description: "Total file size cannot exceed 50MB.",
          duration: 5000,
        });
        return;
      }

      setFiles([...files, ...imageFiles]);
      toast({
        title: "Images added",
        description: `${imageFiles.length} image(s) ready for upscaling.`,
        duration: 3000,
      });
    },
    [files, toast]
  );

  const removeFile = useCallback(
    (file: File) => {
      setFiles(files.filter((f) => f.name !== file.name));
    },
    [files]
  );

  const upscaleImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    const results: UpscaledImage[] = [];

    try {
      for (const file of files) {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Determine which API endpoint to use
        const endpoint = upscaleProvider === 'clipdrop' ? '/api/clipdrop-upscale' : '/api/upscale';

        // Call upscale API with base64 data and userId
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: base64,
            filename: file.name,
            userId: userId, // Include user ID for storing in Supabase
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to upscale ${file.name}`);
        }

        const result = await response.json();
        results.push({
          original: base64,
          upscaled: result.upscaledUrl,
          filename: file.name,
          recordId: result.recordId, // Store the Supabase record ID
          provider: upscaleProvider,
        });
      }

      setUpscaledImages(results);
      toast({
        title: "Upscaling complete",
        description: `Successfully upscaled ${results.length} image(s) using ${upscaleProvider === 'clipdrop' ? 'CLIPDROP' : 'FAL.ai'}.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Upscaling error:", error);
      toast({
        title: "Upscaling failed",
        description: "Something went wrong during upscaling. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [files, userId, upscaleProvider, toast]);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `upscaled_${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"],
    },
  });

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className="rounded-md justify-center align-middle cursor-pointer flex flex-col gap-4"
      >
        <div className="outline-dashed outline-2 outline-gray-100 hover:outline-blue-500 w-full h-full rounded-md p-8 flex justify-center align-middle">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="self-center">Drop the images here...</p>
          ) : (
            <div className="flex justify-center flex-col items-center gap-4">
              <FaImages size={48} className="text-gray-700" />
              <div className="text-center">
                <p className="text-lg font-medium">Upload Images to Upscale</p>
                <p className="text-sm text-gray-500">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: PNG, JPG, JPEG, WebP, BMP, TIFF (Max 50MB total)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-medium">Selected Images ({files.length})</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={upscaleProvider === 'fal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUpscaleProvider('fal')}
                title="Use FAL.ai for upscaling"
              >
                FAL.ai
              </Button>
              <Button
                variant={upscaleProvider === 'clipdrop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUpscaleProvider('clipdrop')}
                title="Use CLIPDROP for upscaling"
              >
                CLIPDROP
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded-md w-full h-24 object-cover"
                  alt="Preview"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file)}
                >
                  ×
                </Button>
                <p className="text-xs text-center mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
          <Button 
            onClick={upscaleImages} 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Upscaling..." : `Upscale ${files.length} Image(s) with ${upscaleProvider === 'clipdrop' ? 'CLIPDROP' : 'FAL.ai'}`}
          </Button>
        </div>
      )}

      {upscaledImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upscaled Results</h3>
          <div className="grid gap-6">
            {upscaledImages.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{result.filename}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {result.provider === 'clipdrop' ? 'CLIPDROP' : 'FAL.ai'}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Original</p>
                    <img
                      src={result.original}
                      className="rounded-md w-full h-48 object-cover"
                      alt="Original"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Upscaled</p>
                    <img
                      src={result.upscaled}
                      className="rounded-md w-full h-48 object-cover"
                      alt="Upscaled"
                    />
                    <Button
                      onClick={() => downloadImage(result.upscaled, result.filename)}
                      className="w-full"
                      variant="outline"
                    >
                      <FaDownload className="mr-2" />
                      Download Upscaled
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}