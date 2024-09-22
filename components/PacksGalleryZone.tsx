'use client'
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";

interface Pack {
  id: string;
  title: string;
  cover_url: string;
  slug: string;
}

export default function PacksGalleryZone() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPacks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Pack[]>('/astria/packs');
      setPacks(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Error fetching packs",
          description: err.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unknown error",
          description: "An unknown error occurred.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <Progress className="w-64" />
        <p className="mt-4 text-sm text-gray-500">Loading packs...</p>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No packs available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {packs.map((pack) => (
        <Link href={`/overview/models/train/${pack.slug}`} key={pack.id} className="w-full h-70 bg-black rounded-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img
            src={pack.cover_url ?? "https://www.astria.ai/assets/logo-b4e21f646fb5879eb91113a70eae015a7413de8920960799acb72c60ad4eaa99.png"}
            alt={pack.title}
            className="w-full h-4/5 object-cover"
          />
          <div className="text-white w-full p-3 text-md font-bold text-center capitalize leading-tight">
            {pack.title}
          </div>
        </Link>
      ))}
    </div>
  );
}