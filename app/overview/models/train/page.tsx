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

export default async function Index() {
  return (
    <div className="py-8 w-full max-w-2xl mx-auto">
      <div id="train-model-container" className="flex flex-1 flex-col gap-2">
        <Link href="/overview">
          <Button>Go Back</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Train Model</CardTitle>
            <CardDescription>
              Choose a name, type, and upload some photos to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <TrainModelZone />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
