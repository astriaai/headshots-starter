"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Database } from "@/types/supabase";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";

type ModelsTableProps = {
  models: Database["public"]["Tables"]["models"]["Row"][];
}

export default async function ModelsTable({
  models,
}: ModelsTableProps) {
  const router = useRouter();
  const handleRedirect = (id: number) => {;
    router.push(`/overview/models/${id}`);
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models?.map((model) => (
          <TableRow key={model.id} onClick={() => handleRedirect(model.id)}>
            <TableCell className="font-medium">{model.name}</TableCell>
            <TableCell>
              {model.status}{" "}
              {model.status === "processing" && (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              )}
            </TableCell>
            <TableCell>{model.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
