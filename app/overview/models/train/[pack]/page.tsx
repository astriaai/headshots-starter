import TrainModelZone from "@/components/TrainModelZone";
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

const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

export default async function Index({ params }: { params: { pack : string } }) {
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        id="train-model-container"
        className="flex flex-1 flex-col gap-2 px-2"
      >
        <Link href={packsIsEnabled ? "/overview/packs" : "/overview"} className="text-sm w-fit">
          <Button variant={"outline"}>
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Train Model</CardTitle>
            <CardDescription>
              Choose a name, type, and upload some photos to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <TrainModelZone packSlug={params.pack} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
