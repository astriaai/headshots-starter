import ImageUpscaleZone from "@/components/ImageUpscaleZone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function UpscalePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-1 flex-col gap-2 px-2">
        <Link href="/overview" className="text-sm w-fit">
          <Button variant="outline">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>AI Image Upscaler</CardTitle>
            <CardDescription>
              Upload any image format and enhance it with AI-powered upscaling.
              Download your high-quality results instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpscaleZone />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}