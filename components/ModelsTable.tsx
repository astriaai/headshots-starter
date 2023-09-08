import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Icons } from "./icons";

export default async function ModelsTable({
  models,
}: {
  models: Database.Model[];
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: models } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", user.id);

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
        {models.map((model) => (
          <TableRow key={model.id}>
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
