import { useEffect, useState } from 'react';
import { ImageInspectionResult, inspectImage } from '@/lib/imageInspection';
import { Loader2 } from 'lucide-react';

export interface ImageInspectorProps {
  file: File;
  type: string;
  onInspectionComplete: (result: ImageInspectionResult) => void;
}

export function ImageInspector({ file, type, onInspectionComplete }: ImageInspectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    
    const inspect = async () => {
      try {
        setIsLoading(true);
        const result = await inspectImage(file, type);
        if (!controller.signal.aborted) {
          const detectedIssues: string[] = [];

          if (result.selfie) {
            detectedIssues.push('Selfie');
          }
          if (result.blurry) {
            detectedIssues.push('Image is blurry');
          }
          if (result.includes_multiple_people) {
            detectedIssues.push('Multiple people');
          }
          if (result.full_body_image_or_longshot) {
            detectedIssues.push('Image is not a close-up');
          }
          if (result.wearing_sunglasses) {
            detectedIssues.push('Wearing sunglasses');
          }
          if (result.wearing_hat) {
            detectedIssues.push('Wearing hat');
          }
          if (result.funny_face) {
            detectedIssues.push('Funny face');
          }
          if (result.name && result.name !== type) {
            detectedIssues.push(`Detected ${result.name}, expected ${type}`);
          }

          setIssues(detectedIssues);
          onInspectionComplete(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setIssues(['Failed to inspect image']);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    inspect();

    return () => {
      controller.abort();
    };
  }, [file, type]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
        <Loader2 className="h-3 w-3 animate-spin" />
        Inspecting image...
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-xs text-green-600">
        ✓ Image looks good
      </div>
    );
  }

  return (
    <ul className="text-xs w-16 text-wrap pl-2">
      {issues.map((issue, index) => (
        <li key={index} className="text-yellow-500">⚠️{issue}</li>
      ))}
    </ul>
  );
}


