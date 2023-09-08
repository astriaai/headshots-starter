import TrainModelZone from "@/components/TrainModelZone";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex flex-1 w-full h-screen flex-col">
      <div
        id="train-model-container"
        className="w-full h-full px-20 py-10 max-w-screen-md flex flex-col gap-2"
      >
        <Link href="/overview">
          <Button>Go Back</Button>
        </Link>
        <h1>Train Model</h1>
        <TrainModelZone />
      </div>
    </div>
  );
}
