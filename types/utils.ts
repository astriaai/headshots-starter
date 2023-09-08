import { Database } from "./supabase";

export type modelRow = Database["public"]["Tables"]["models"]["Row"];
export type imageRow = Database["public"]["Tables"]["images"]["Row"];